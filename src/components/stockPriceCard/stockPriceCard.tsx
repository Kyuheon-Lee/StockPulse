import type { ImgHTMLAttributes, KeyboardEvent } from 'react';
import styles from './stockPriceCard.module.scss';

type LiveStatus = {
    isLive: boolean;
    liveLabel: string;
    idleLabel: string;
};

type Variant = 'dashboard' | 'compact';

type ChangeTone = 'up' | 'down' | 'neutral';

type StockPriceCardProps = {
    symbol: string;
    logoUrl?: string;
    logoProps?: ImgHTMLAttributes<HTMLImageElement>;
    companyName?: string;
    priceLabel: string;
    changeLabel: string;
    changeTone: ChangeTone;
    isLiked: boolean;
    likeText?: string;
    onToggleLike: () => void;
    onClick?: () => void;
    liveStatus?: LiveStatus;
    variant: Variant;
};

function StockPriceCard({
    symbol,
    logoUrl,
    companyName,
    priceLabel,
    changeLabel,
    changeTone,
    isLiked,
    likeText,
    onToggleLike,
    onClick,
    liveStatus,
    variant,
    logoProps,
}: StockPriceCardProps) {
    const variantClass =
        variant === 'dashboard' ? styles.dashboard : styles.compact;
    const cardClassName = `${styles.card} ${variantClass}${
        onClick ? ` ${styles.clickable}` : ''
    }`;
    const changeClassName = `${styles.change} ${
        changeTone === 'up'
            ? styles.up
            : changeTone === 'down'
              ? styles.down
              : ''
    }`;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!onClick) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={cardClassName}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <button
                type="button"
                className={`${styles.likeButton} ${isLiked ? styles.likeActive : ''}`}
                onClick={(event) => {
                    event.stopPropagation();
                    onToggleLike();
                }}
                aria-pressed={isLiked}
                aria-label={isLiked ? '관심에서 제거' : '관심에 추가'}
            >
                {likeText ? (
                    <span className={styles.likeText}>{likeText}</span>
                ) : null}
                <svg
                    className={styles.likeIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M12 20.25c-.3 0-.6-.11-.83-.34l-6.3-6.14a4.75 4.75 0 0 1 6.72-6.72L12 7.43l.41-.38a4.75 4.75 0 0 1 6.72 6.72l-6.3 6.14c-.23.23-.53.34-.83.34z" />
                </svg>
            </button>
            {logoUrl && (
                <img
                    className={styles.logo}
                    src={logoUrl}
                    alt={`${symbol} 로고`}
                    loading="lazy"
                    {...(logoProps ?? {})}
                />
            )}
            <div className={styles.ticker}>{symbol}</div>
            {companyName ? (
                <div className={styles.companyName}>{companyName}</div>
            ) : null}
            <div className={styles.price}>{priceLabel}</div>
            <div className={changeClassName}>{changeLabel}</div>
            {liveStatus ? (
                <div className={styles.liveRow}>
                    <span
                        className={
                            liveStatus.isLive
                                ? styles.liveDotActive
                                : styles.liveDot
                        }
                    />
                    <span className={styles.liveLabel}>
                        {liveStatus.isLive
                            ? liveStatus.liveLabel
                            : liveStatus.idleLabel}
                    </span>
                </div>
            ) : null}
        </div>
    );
}

export default StockPriceCard;
