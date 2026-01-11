import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CompanyDetailsCard from './components/CompanyDetailsCard';
import TradePanel from './components/TradePanel';
import StockPriceCard from '../../components/stockPriceCard/stockPriceCard';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { useSearchQuote } from '../../hooks/useSearchQuote';
import { useStockStore } from '../../stores/stockStore';
import {
    formatCurrency,
    formatSignedCurrency,
    formatSignedPercent,
} from '../../utils/formatters';
import styles from './dashboard.module.scss';
import { useSettingsStore } from '../../stores/settingsStore';

type TradeTick = {
    price: number;
    time: number;
};

function DashboardPage() {
    const [searchParams] = useSearchParams();
    const symbol = useMemo(
        () => (searchParams.get('symbol') ?? '').toUpperCase(),
        [searchParams],
    );
    const [trade, setTrade] = useState<TradeTick | null>(null);
    const quoteQuery = useSearchQuote(symbol ? [symbol] : []);
    const profileQuery = useCompanyProfile(symbol ? [symbol] : []);
    const quote = quoteQuery[0]?.data;
    const profile = profileQuery[0]?.data;
    const toggleWatchlist = useStockStore((state) => state.toggleWatchlist);
    const buyStock = useStockStore((state) => state.buyStock);
    const sellStock = useStockStore((state) => state.sellStock);
    const position = useStockStore((state) =>
        symbol ? state.positions[symbol] : undefined,
    );
    const isLiked = useStockStore((state) =>
        symbol ? state.watchlist.includes(symbol) : false,
    );
    const finnhubToken = useSettingsStore((state) => state.finnhubApiKey);
    useEffect(() => {
        if (!symbol) {
            return;
        }

        setTrade(null);

        const ws = new WebSocket(`wss://ws.finnhub.io?token=${finnhubToken}`);

        const handleOpen = () => {
            ws.send(JSON.stringify({ type: 'subscribe', symbol }));
        };

        const handleMessage = (event: MessageEvent) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type !== 'trade' || !payload.data?.length) {
                    return;
                }
                const latest = payload.data[payload.data.length - 1];
                setTrade({ price: latest.p, time: latest.t });
            } catch {
                // 잘못된 메시지는 무시합니다.
            }
        };

        ws.addEventListener('open', handleOpen);
        ws.addEventListener('message', handleMessage);

        return () => {
            try {
                ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
            } catch {
                // 소켓이 이미 닫힌 경우는 무시합니다.
            }
            ws.close();
        };
    }, [symbol]);

    const price = trade?.price ?? quote?.c;
    const previousClose = quote?.pc;
    const change =
        price !== undefined && previousClose !== undefined
            ? price - previousClose
            : quote?.d;
    const changePercent =
        change !== undefined &&
        previousClose !== undefined &&
        previousClose !== 0
            ? (change / previousClose) * 100
            : quote?.dp;
    const changeTone =
        change === undefined ? 'neutral' : change >= 0 ? 'up' : 'down';
    const changeLabel =
        change === undefined || changePercent === undefined
            ? '--'
            : `${formatSignedCurrency(change)} (${formatSignedPercent(changePercent)})`;

    if (!symbol) {
        return (
            <section className={styles.emptyState}>
                <h2>티커를 선택하세요</h2>
                <p>종목을 검색해 대시보드를 열어보세요.</p>
            </section>
        );
    }

    return (
        <section className={styles.dashboard}>
            <div className={styles.leftColumn}>
                <StockPriceCard
                    symbol={symbol}
                    logoUrl={profile?.logo}
                    companyName={profile?.name ?? '불러오는 중...'}
                    priceLabel={formatCurrency(price)}
                    changeTone={changeTone}
                    changeLabel={changeLabel}
                    isLiked={isLiked}
                    likeText={isLiked ? '관심 중' : '관심'}
                    onToggleLike={() => toggleWatchlist(symbol)}
                    liveStatus={{
                        isLive: Boolean(trade),
                        liveLabel: '실시간',
                        idleLabel: '실시간 시세 대기 중',
                    }}
                    variant="dashboard"
                />
                <TradePanel
                    symbol={symbol}
                    price={price}
                    position={position}
                    onBuy={buyStock}
                    onSell={sellStock}
                />
            </div>
            <CompanyDetailsCard profile={profile} />
        </section>
    );
}

export default DashboardPage;
