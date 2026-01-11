import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchQuote } from '../../hooks/useSearchQuote';
import { useStockStore } from '../../stores/stockStore';
import type { QuoteData } from '../../types/interfaces';
import {
    formatCurrency,
    formatNumber,
    formatSignedCurrency,
    formatSignedPercent,
} from '../../utils/formatters';
import styles from './portfolio.module.scss';

type HoldingRow = {
    symbol: string;
    quantity: number;
    averagePrice: number;
    realizedPnL: number;
    currentPrice?: number;
};

function PortfolioPage() {
    const navigate = useNavigate();
    const positions = useStockStore((state) => state.positions);
    const trades = useStockStore((state) => state.trades);
    const symbols = Object.keys(positions);
    const quoteQueries = useSearchQuote(symbols);

    const quoteMap = useMemo(() => {
        const next: Record<string, QuoteData | undefined> = {};
        quoteQueries.forEach((query) => {
            if (query.symbol) {
                next[query.symbol] = query.data;
            }
        });
        return next;
    }, [quoteQueries]);

    const rows: HoldingRow[] = symbols.map((symbol) => ({
        symbol,
        quantity: positions[symbol].quantity,
        averagePrice: positions[symbol].averagePrice,
        realizedPnL: positions[symbol].realizedPnL,
        currentPrice: quoteMap[symbol]?.c,
    }));

    const totals = rows.reduce(
        (acc, row) => {
            const cost = row.averagePrice * row.quantity;
            const marketValue =
                row.currentPrice !== undefined
                    ? row.currentPrice * row.quantity
                    : undefined;
            acc.cost += cost;
            acc.realized += row.realizedPnL;
            if (marketValue !== undefined) {
                acc.marketValue += marketValue;
                acc.unrealized += marketValue - cost;
                acc.hasMarketValue = true;
            }
            return acc;
        },
        {
            cost: 0,
            marketValue: 0,
            unrealized: 0,
            realized: 0,
            hasMarketValue: false,
        },
    );

    const totalPnL = totals.realized + totals.unrealized;
    const totalPnLPercent =
        totals.cost > 0 ? (totalPnL / totals.cost) * 100 : undefined;

    return (
        <section className={styles.portfolio}>
            <div className={styles.hero}>
                <h2>나의 주식</h2>
                <p>시뮬레이션 포트폴리오 성과를 확인하세요.</p>
            </div>

            {symbols.length === 0 ? (
                <div className={styles.emptyState}>
                    아직 모의 투자 내역이 없어요. 대시보드에서 매수/매도를
                    진행해 보세요.
                </div>
            ) : (
                <>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryCard}>
                            <span>총 매입금액</span>
                            <strong>{formatCurrency(totals.cost)}</strong>
                        </div>
                        <div className={styles.summaryCard}>
                            <span>현재 평가금액</span>
                            <strong>
                                {totals.hasMarketValue
                                    ? formatCurrency(totals.marketValue)
                                    : '--'}
                            </strong>
                        </div>
                        <div
                            className={`${styles.summaryCard} ${totalPnL >= 0 ? styles.up : styles.down}`}
                        >
                            <span>총 손익</span>
                            <strong>
                                {totals.hasMarketValue
                                    ? formatSignedCurrency(totalPnL)
                                    : '--'}
                            </strong>
                            <em>
                                {totals.hasMarketValue
                                    ? formatSignedPercent(totalPnLPercent)
                                    : '--'}
                            </em>
                        </div>
                    </div>

                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>종목</span>
                            <span>보유 수량</span>
                            <span>평균 단가</span>
                            <span>현재가</span>
                            <span>평가금액</span>
                            <span>손익</span>
                        </div>
                        {rows.map((row) => {
                            const cost = row.averagePrice * row.quantity;
                            const marketValue =
                                row.currentPrice !== undefined
                                    ? row.currentPrice * row.quantity
                                    : undefined;
                            const unrealized =
                                marketValue !== undefined
                                    ? marketValue - cost
                                    : undefined;
                            const total =
                                unrealized !== undefined
                                    ? unrealized + row.realizedPnL
                                    : undefined;
                            const totalPercent =
                                total !== undefined && cost > 0
                                    ? (total / cost) * 100
                                    : undefined;
                            const pnlClass =
                                total === undefined
                                    ? styles.neutral
                                    : total >= 0
                                      ? styles.up
                                      : styles.down;

                            return (
                                <div
                                    key={row.symbol}
                                    className={styles.row}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        navigate(
                                            `/dashboard?symbol=${encodeURIComponent(
                                                row.symbol,
                                            )}`,
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === ' '
                                        ) {
                                            event.preventDefault();
                                            navigate(
                                                `/dashboard?symbol=${encodeURIComponent(
                                                    row.symbol,
                                                )}`,
                                            );
                                        }
                                    }}
                                >
                                    <strong>{row.symbol}</strong>
                                    <span>{formatNumber(row.quantity, 0)}</span>
                                    <span>
                                        {formatCurrency(row.averagePrice)}
                                    </span>
                                    <span>
                                        {row.currentPrice !== undefined
                                            ? formatCurrency(row.currentPrice)
                                            : '--'}
                                    </span>
                                    <span>
                                        {marketValue !== undefined
                                            ? formatCurrency(marketValue)
                                            : '--'}
                                    </span>
                                    <span
                                        className={`${styles.pnlValue} ${pnlClass}`}
                                    >
                                        {total !== undefined
                                            ? formatSignedCurrency(total)
                                            : '--'}
                                        <em>
                                            {totalPercent !== undefined
                                                ? formatSignedPercent(
                                                      totalPercent,
                                                  )
                                                : '--'}
                                        </em>
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.history}>
                        <h3>최근 거래</h3>
                        {trades.length === 0 ? (
                            <div className={styles.emptyState}>아직 거래가 없어요.</div>
                        ) : (
                            <div className={styles.historyList}>
                                {trades.slice(0, 6).map((trade) => (
                                    <div
                                        key={trade.id}
                                        className={styles.historyItem}
                                    >
                                        <div>
                                            <strong>{trade.symbol}</strong>
                                            <span>
                                                {trade.side === 'buy'
                                                    ? '매수'
                                                    : '매도'}
                                            </span>
                                        </div>
                                        <div>
                                            <span>
                                                {formatCurrency(trade.price)} x{' '}
                                                {formatNumber(trade.quantity, 0)}
                                            </span>
                                            <em>
                                                {new Date(
                                                    trade.timestamp,
                                                ).toLocaleString('ko-KR', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </em>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}

export default PortfolioPage;
