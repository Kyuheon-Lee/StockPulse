import { useMarketNews } from '../../hooks/useMarketNews';
import styles from '../../pages/home/home.module.scss';

type NewsSectionProps = {
    title: string;
    description: string;
    query: ReturnType<typeof useMarketNews>;
};

function NewsSection({ title, description, query }: NewsSectionProps) {
    const items = query.data?.slice(0, 6) ?? [];

    return (
        <section className={styles.newsSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
                {query.isFetching && (
                    <span className={styles.badge}>새로고침 중</span>
                )}
            </div>
            {query.isError ? (
                <div className={styles.state}>
                    뉴스를 불러오지 못했습니다.
                </div>
            ) : query.isLoading ? (
                <div className={styles.state}>뉴스 불러오는 중...</div>
            ) : items.length === 0 ? (
                <div className={styles.state}>표시할 뉴스가 없습니다.</div>
            ) : (
                <div className={styles.cards}>
                    {items.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            className={styles.card}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.headline}
                                    loading="lazy"
                                />
                            ) : (
                                <div className={styles.cardImagePlaceholder} />
                            )}
                            <div className={styles.cardBody}>
                                <div className={styles.cardMeta}>
                                    <span>{item.source}</span>
                                    <span>{formatNewsDate(item.datetime)}</span>
                                </div>
                                <h4>{item.headline}</h4>
                                <p>{item.summary}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}

function formatNewsDate(timestamp: number) {
    if (!timestamp) {
        return '--';
    }
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
    });
}

export default NewsSection;
