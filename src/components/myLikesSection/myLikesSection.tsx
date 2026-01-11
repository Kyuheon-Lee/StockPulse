import { useNavigate } from 'react-router-dom';
import type { StockCardQuery } from '../../hooks/useStockCards';
import { useStockStore } from '../../stores/stockStore';
import {
    formatCurrency,
    formatSignedCurrency,
    formatSignedPercent,
} from '../../utils/formatters';
import StockPriceCard from '../stockPriceCard/stockPriceCard';
import styles from './myLikesSection.module.scss';

interface MyLikesSectionProps {
    stockCards: StockCardQuery[];
}

function LikeCard({ card }: { card: StockCardQuery }) {
    const price = card.quote?.c;
    const change = card.quote?.d;
    const changePercent = card.quote?.dp;
    const isUp = change !== undefined && change >= 0;
    const toggleWatchlist = useStockStore((state) => state.toggleWatchlist);
    const isLiked = useStockStore((state) =>
        state.watchlist.includes(card.symbol),
    );
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/dashboard?symbol=${encodeURIComponent(card.symbol)}`);
    };
    const changeLabel =
        change === undefined || changePercent === undefined
            ? '--'
            : `${formatSignedCurrency(change)} (${formatSignedPercent(changePercent)})`;
    const changeTone =
        change === undefined ? 'neutral' : isUp ? 'up' : 'down';

    return (
        <StockPriceCard
            symbol={card.symbol}
            logoUrl={card.profile?.logo}
            logoProps={{
                decoding: 'async',
                fetchPriority: 'low',
                width: 44,
                height: 44,
            }}
            priceLabel={
                card.isLoading ? '불러오는 중...' : formatCurrency(price)
            }
            changeLabel={card.isLoading ? '불러오는 중...' : changeLabel}
            changeTone={changeTone}
            isLiked={isLiked}
            onToggleLike={() => toggleWatchlist(card.symbol)}
            onClick={handleCardClick}
            variant="compact"
        />
    );
}

function MyLikesSection({ stockCards }: MyLikesSectionProps) {
    return (
        <section>
            <h2 className={styles.sectionTitle}>관심 목록</h2>
            <div className={styles.likesGrid}>
                {stockCards.map((card) => (
                    <LikeCard key={card.symbol} card={card} />
                ))}
            </div>
        </section>
    );
}

export default MyLikesSection;
