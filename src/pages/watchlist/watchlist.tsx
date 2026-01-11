import MyLikesSection from '../../components/myLikesSection/myLikesSection';
import { useStockCards } from '../../hooks/useStockCards';
import { useStockStore } from '../../stores/stockStore';

function WatchlistPage() {
    const watchlist = useStockStore((state) => state.watchlist);
    const stockCards = useStockCards(watchlist);

    return <MyLikesSection stockCards={stockCards} />;
}

export default WatchlistPage;
