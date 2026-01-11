import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchSymbol } from '../../hooks/useSearchSymbol';
import { useStockStore } from '../../stores/stockStore';
import styles from './searchBar.module.scss';

interface SearchBarProps {
    placeholder?: string;
}

function SearchBar({ placeholder = '검색' }: SearchBarProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const symbolQuery = useSearchSymbol(submittedQuery);
    const results = symbolQuery.data?.result ?? [];
    const toggleWatchlist = useStockStore((state) => state.toggleWatchlist);
    const watchlist = useStockStore((state) => state.watchlist);

    const closeResults = () => {
        setSearchQuery('');
        setSubmittedQuery('');
    };

    const handleSearch = () => {
        const trimmed = searchQuery.trim();

        if (!trimmed) {
            setSubmittedQuery('');
            return;
        }

        if (trimmed === submittedQuery) {
            symbolQuery.refetch();
            return;
        }

        setSubmittedQuery(trimmed);
    };

    const handleSelect = (symbol: string) => {
        closeResults();
        navigate(`/dashboard?symbol=${encodeURIComponent(symbol)}`);
    };

    return (
        <div className={styles.searchBar}>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                검색
            </button>
            {submittedQuery && (
                <div className={styles.overlay} onClick={closeResults} />
            )}
            {submittedQuery && (
                <div className={styles.results}>
                    {symbolQuery.isFetching ? (
                        <div className={styles.resultsState}>불러오는 중...</div>
                    ) : symbolQuery.isError ? (
                        <div className={styles.resultsState}>
                            검색 중 오류가 발생했습니다.
                        </div>
                    ) : results.length === 0 ? (
                        <div className={styles.resultsState}>
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        <ul className={styles.resultsList}>
                            {results.map((item) => {
                                const symbol = item.symbol.toUpperCase();
                                const isLiked = watchlist.includes(symbol);

                                return (
                                    <li
                                        key={`${item.symbol}-${item.displaySymbol}`}
                                        className={styles.resultItem}
                                    >
                                        <button
                                            type="button"
                                            className={styles.resultInfo}
                                            onClick={() =>
                                                handleSelect(item.symbol)
                                            }
                                        >
                                            <span
                                                className={styles.resultSymbol}
                                            >
                                                {item.displaySymbol}
                                            </span>
                                            <span
                                                className={
                                                    styles.resultDescription
                                                }
                                            >
                                                {item.description}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.likeButton} ${isLiked ? styles.likeActive : ''}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                toggleWatchlist(item.symbol);
                                            }}
                                            aria-pressed={isLiked}
                                            aria-label={
                                                isLiked
                                                    ? '관심에서 제거'
                                                    : '관심에 추가'
                                            }
                                        >
                                            <span className={styles.likeText}>
                                                {isLiked ? '관심 중' : '관심'}
                                            </span>
                                            <svg
                                                className={styles.likeIcon}
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 20.25c-.3 0-.6-.11-.83-.34l-6.3-6.14a4.75 4.75 0 0 1 6.72-6.72L12 7.43l.41-.38a4.75 4.75 0 0 1 6.72 6.72l-6.3 6.14c-.23.23-.53.34-.83.34z" />
                                            </svg>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
