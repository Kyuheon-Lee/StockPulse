import { useCompanyNews } from '../../hooks/useCompanyNews';
import { useMarketNews } from '../../hooks/useMarketNews';
import { useStockStore } from '../../stores/stockStore';
import NewsSection from '../../components/newsSection/NewsSection';
import styles from './home.module.scss';

function HomePage() {
    const generalNews = useMarketNews('general');
    const mergerNews = useMarketNews('merger');
    const watchlist = useStockStore((state) => state.watchlist);
    const companyNews = useCompanyNews(watchlist);

    return (
        <section className={styles.home}>
            <LiveStreamCard />
            <div className={styles.hero}>
                <h2>시장 뉴스</h2>
                <p>핀허브에서 가져온 주요 뉴스와 인수합병 업데이트입니다.</p>
            </div>

            <div className={styles.newsLayout}>
                <div className={styles.newsGrid}>
                    <NewsSection
                        title="종합"
                        description="시장 전반의 헤드라인과 매크로 업데이트."
                        query={generalNews}
                    />
                    <NewsSection
                        title="인수합병 동향"
                        description="인수합병 헤드라인과 거래 소식."
                        query={mergerNews}
                    />
                </div>
                <aside className={styles.companyNews}>
                    <div className={styles.companyNewsHeader}>
                        <div>
                            <h3>관심 기업 뉴스</h3>
                            <p>관심 목록의 최신 헤드라인을 모았습니다.</p>
                        </div>
                        {companyNews.isLoading && (
                            <span className={styles.badge}>업데이트 중</span>
                        )}
                    </div>
                    {watchlist.length === 0 ? (
                        <div className={styles.state}>
                            관심 종목을 추가하면 최신 헤드라인을 볼 수 있어요.
                        </div>
                    ) : companyNews.isError ? (
                        <div className={styles.state}>
                            기업 뉴스를 불러오지 못했습니다.
                        </div>
                    ) : companyNews.items.length === 0 ? (
                        <div className={styles.state}>
                            관심 목록의 최근 뉴스가 없습니다.
                        </div>
                    ) : (
                        <div className={styles.companyNewsList}>
                            {companyNews.items.map((item) => (
                                <a
                                    key={`${item.symbol}-${item.id}`}
                                    className={styles.companyNewsItem}
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className={styles.companyNewsMeta}>
                                        <span
                                            className={styles.companyNewsSymbol}
                                        >
                                            {item.symbol}
                                        </span>
                                        <span>{item.source}</span>
                                    </div>
                                    <p className={styles.companyNewsHeadline}>
                                        {item.headline}
                                    </p>
                                </a>
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default HomePage;

function LiveStreamCard() {
    const FUTURES_NOW_CHANNEL_ID = 'UC_JJ_NhRqPKcIOj5Ko3W_3w';
    const FUTURES_NOW_CHANNEL_URL = 'https://www.youtube.com/@futuresnow';
    const FUTURES_NOW_LIVE_EMBED_BASE =
        'https://www.youtube.com/embed/live_stream';
    const embedUrl = `${FUTURES_NOW_LIVE_EMBED_BASE}?channel=${FUTURES_NOW_CHANNEL_ID}&autoplay=1&mute=1&playsinline=1`;
    return (
        <section className={styles.liveStream}>
            <div className={styles.liveStreamHeader}>
                <div>
                    <h3> 오선의 미국 증시 라이브 </h3>
                    <p>채널이 라이브가 되면 자동 재생됩니다.</p>
                </div>
            </div>
            <div className={styles.liveStreamPlayer}>
                <iframe
                    title="오선 라이브 스트림"
                    src={embedUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
            <div className={styles.liveStreamActions}>
                <a
                    className={styles.liveStreamButton}
                    href={FUTURES_NOW_CHANNEL_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    채널 열기
                </a>
            </div>
        </section>
    );
}
