import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TradeSide = 'buy' | 'sell';

type Trade = {
    id: string;
    symbol: string;
    side: TradeSide;
    price: number;
    quantity: number;
    timestamp: number;
};

export type Position = {
    symbol: string;
    quantity: number;
    averagePrice: number;
    realizedPnL: number;
};

interface StockState {
    watchlist: string[]; // 티커 배열
    positions: Record<string, Position>;
    trades: Trade[];
    addToWatchlist: (ticker: string) => void;
    removeFromWatchlist: (ticker: string) => void;
    toggleWatchlist: (ticker: string) => void;
    buyStock: (ticker: string, price: number, quantity: number) => boolean;
    sellStock: (ticker: string, price: number, quantity: number) => boolean;
}

const MAX_TRADES = 200;

const normalizeSymbol = (ticker: string) => ticker.trim().toUpperCase();

const createTrade = (
    side: TradeSide,
    symbol: string,
    price: number,
    quantity: number,
): Trade => ({
    id: `${symbol}-${side}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    symbol,
    side,
    price,
    quantity,
    timestamp: Date.now(),
});

export const useStockStore = create<StockState>()(
    persist(
        (set, get) => ({
            watchlist: [],
            positions: {},
            trades: [],
            addToWatchlist: (ticker) => {
                const normalized = normalizeSymbol(ticker);
                set((state) =>
                    state.watchlist.includes(normalized)
                        ? state
                        : { watchlist: [...state.watchlist, normalized] },
                );
            },
            removeFromWatchlist: (ticker) => {
                const normalized = normalizeSymbol(ticker);
                set((state) => ({
                    watchlist: state.watchlist.filter(
                        (item) => item !== normalized,
                    ),
                }));
            },
            toggleWatchlist: (ticker) => {
                const normalized = normalizeSymbol(ticker);
                const hasTicker = get().watchlist.includes(normalized);
                set((state) => ({
                    watchlist: hasTicker
                        ? state.watchlist.filter(
                              (item) => item !== normalized,
                          )
                        : [...state.watchlist, normalized],
                }));
            },
            buyStock: (ticker, price, quantity) => {
                const normalized = normalizeSymbol(ticker);
                if (!normalized || price <= 0 || quantity <= 0) {
                    return false;
                }

                set((state) => {
                    const current = state.positions[normalized];
                    const currentQty = current?.quantity ?? 0;
                    const newQty = currentQty + quantity;
                    const newAverage =
                        currentQty > 0
                            ? (current.averagePrice * currentQty +
                                  price * quantity) /
                              newQty
                            : price;
                    const updated: Position = {
                        symbol: normalized,
                        quantity: newQty,
                        averagePrice: newAverage,
                        realizedPnL: current?.realizedPnL ?? 0,
                    };
                    return {
                        positions: {
                            ...state.positions,
                            [normalized]: updated,
                        },
                        trades: [
                            createTrade('buy', normalized, price, quantity),
                            ...state.trades,
                        ].slice(0, MAX_TRADES),
                    };
                });
                return true;
            },
            sellStock: (ticker, price, quantity) => {
                const normalized = normalizeSymbol(ticker);
                if (!normalized || price <= 0 || quantity <= 0) {
                    return false;
                }
                const current = get().positions[normalized];
                if (!current || current.quantity < quantity) {
                    return false;
                }

                set((state) => {
                    const existing = state.positions[normalized];
                    if (!existing) {
                        return state;
                    }
                    const remainingQty = existing.quantity - quantity;
                    const realizedDelta =
                        (price - existing.averagePrice) * quantity;
                    const updated: Position = {
                        symbol: normalized,
                        quantity: remainingQty,
                        averagePrice:
                            remainingQty > 0 ? existing.averagePrice : 0,
                        realizedPnL: existing.realizedPnL + realizedDelta,
                    };
                    const nextPositions = { ...state.positions };
                    if (remainingQty > 0) {
                        nextPositions[normalized] = updated;
                    } else {
                        delete nextPositions[normalized];
                    }
                    return {
                        positions: nextPositions,
                        trades: [
                            createTrade('sell', normalized, price, quantity),
                            ...state.trades,
                        ].slice(0, MAX_TRADES),
                    };
                });

                return true;
            },
        }),
        { name: 'stock-pulse-watchlist' },
    ),
);
