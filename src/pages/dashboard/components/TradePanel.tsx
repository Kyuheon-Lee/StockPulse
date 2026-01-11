import { useEffect, useMemo, useState } from 'react';
import type { Position } from '../../../stores/stockStore';
import {
    formatCurrency,
    formatNumber,
    formatSignedCurrency,
} from '../../../utils/formatters';
import styles from '../dashboard.module.scss';

type TradePanelProps = {
    symbol: string;
    price?: number;
    position?: Position;
    onBuy: (symbol: string, price: number, quantity: number) => boolean;
    onSell: (symbol: string, price: number, quantity: number) => boolean;
};

const parseInputNumber = (value: string) => {
    if (!value.trim()) {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

function TradePanel({ symbol, price, position, onBuy, onSell }: TradePanelProps) {
    const [tradePriceInput, setTradePriceInput] = useState('');
    const [tradeQuantityInput, setTradeQuantityInput] = useState('');
    const [tradeError, setTradeError] = useState('');

    useEffect(() => {
        setTradeError('');
        setTradeQuantityInput('');
    }, [symbol]);

    const positionPnL = useMemo(() => {
        if (!position || price === undefined) {
            return undefined;
        }
        const positionValue = position.quantity * price;
        const positionCost = position.quantity * position.averagePrice;
        return positionValue - positionCost;
    }, [position, price]);

    const handleUseMarketPrice = () => {
        if (price !== undefined) {
            setTradePriceInput(price.toFixed(2));
        }
    };

    const handleTrade = (side: 'buy' | 'sell') => {
        setTradeError('');
        const parsedPrice = parseInputNumber(tradePriceInput);
        const parsedQuantity = parseInputNumber(tradeQuantityInput);

        if (!parsedPrice || parsedPrice <= 0 || !parsedQuantity || parsedQuantity <= 0) {
            setTradeError('가격과 수량을 올바르게 입력해 주세요.');
            return;
        }

        if (side === 'sell') {
            if (!position || parsedQuantity > position.quantity) {
                setTradeError('보유 수량보다 많은 수량을 매도할 수 없습니다.');
                return;
            }
            if (!onSell(symbol, parsedPrice, parsedQuantity)) {
                setTradeError('매도 처리에 실패했습니다.');
                return;
            }
        } else {
            if (!onBuy(symbol, parsedPrice, parsedQuantity)) {
                setTradeError('매수 처리에 실패했습니다.');
                return;
            }
        }

        setTradeQuantityInput('');
    };

    return (
        <div className={styles.tradeCard}>
            <div className={styles.tradeHeader}>
                <div>
                    <h3>투자 시뮬레이션</h3>
                    <p>가격과 수량을 입력해 매수/매도를 진행하세요.</p>
                </div>
                <button
                    type="button"
                    className={styles.fillButton}
                    onClick={handleUseMarketPrice}
                >
                    현재가 사용
                </button>
            </div>
            <div className={styles.tradeForm}>
                <label className={styles.tradeField}>
                    <span>가격</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tradePriceInput}
                        onChange={(event) =>
                            setTradePriceInput(event.target.value)
                        }
                        placeholder={formatCurrency(price)}
                    />
                </label>
                <label className={styles.tradeField}>
                    <span>수량</span>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={tradeQuantityInput}
                        onChange={(event) =>
                            setTradeQuantityInput(event.target.value)
                        }
                        placeholder="0"
                    />
                </label>
                <div className={styles.tradeActions}>
                    <button
                        type="button"
                        className={styles.buyButton}
                        onClick={() => handleTrade('buy')}
                    >
                        매수
                    </button>
                    <button
                        type="button"
                        className={styles.sellButton}
                        onClick={() => handleTrade('sell')}
                    >
                        매도
                    </button>
                </div>
                {tradeError && (
                    <div className={styles.tradeError}>{tradeError}</div>
                )}
            </div>
            <div className={styles.positionSummary}>
                <div>
                    <span>보유 수량</span>
                    <strong>
                        {position ? formatNumber(position.quantity, 0) : '--'}
                    </strong>
                </div>
                <div>
                    <span>평균 단가</span>
                    <strong>
                        {position
                            ? formatCurrency(position.averagePrice)
                            : '--'}
                    </strong>
                </div>
                <div>
                    <span>평가 손익</span>
                    <strong
                        className={
                            positionPnL === undefined
                                ? styles.neutral
                                : positionPnL >= 0
                                  ? styles.up
                                  : styles.down
                        }
                    >
                        {positionPnL !== undefined
                            ? formatSignedCurrency(positionPnL)
                            : '--'}
                    </strong>
                </div>
            </div>
        </div>
    );
}

export default TradePanel;
