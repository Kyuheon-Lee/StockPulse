import type { CompanyProfileData } from '../../../types/interfaces';
import { formatCurrency, formatNumber } from '../../../utils/formatters';
import styles from '../dashboard.module.scss';

type CompanyDetailsCardProps = {
    profile?: CompanyProfileData;
};

const formatMarketCap = (value?: number) => {
    if (value === undefined || Number.isNaN(value)) {
        return '--';
    }
    if (value >= 1_000_000_000_000) {
        return `${formatNumber(value / 1_000_000_000_000)}조 달러`;
    }
    if (value >= 1_000_000_000) {
        return `${formatNumber(value / 1_000_000_000)}십억 달러`;
    }
    if (value >= 1_000_000) {
        return `${formatNumber(value / 1_000_000)}백만 달러`;
    }
    return formatCurrency(value, 0);
};

function CompanyDetailsCard({ profile }: CompanyDetailsCardProps) {
    return (
        <aside className={styles.rightColumn}>
            <h3>기업 정보</h3>
            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <span>거래소</span>
                    <strong>{profile?.exchange ?? '--'}</strong>
                </div>
                <div className={styles.detailItem}>
                    <span>산업</span>
                    <strong>{profile?.finnhubIndustry ?? '--'}</strong>
                </div>
                <div className={styles.detailItem}>
                    <span>국가</span>
                    <strong>{profile?.country ?? '--'}</strong>
                </div>
                <div className={styles.detailItem}>
                    <span>상장일</span>
                    <strong>{profile?.ipo ?? '--'}</strong>
                </div>
                <div className={styles.detailItem}>
                    <span>시가총액</span>
                    <strong>
                        {formatMarketCap(profile?.marketCapitalization)}
                    </strong>
                </div>
                <div className={styles.detailItem}>
                    <span>발행주식수</span>
                    <strong>
                        {profile?.shareOutstanding !== undefined
                            ? `${formatNumber(profile.shareOutstanding, 0)}`
                            : '--'}
                    </strong>
                </div>
                <div className={styles.detailItem}>
                    <span>통화</span>
                    <strong>{profile?.currency ?? '--'}</strong>
                </div>
                <div className={styles.detailItem}>
                    <span>웹사이트</span>
                    {profile?.weburl ? (
                        <a href={profile.weburl} target="_blank" rel="noreferrer">
                            {profile.weburl.replace(/^https?:\/\//, '')}
                        </a>
                    ) : (
                        <strong>--</strong>
                    )}
                </div>
                <div className={styles.detailItem}>
                    <span>전화번호</span>
                    <strong>{profile?.phone ?? '--'}</strong>
                </div>
            </div>
        </aside>
    );
}

export default CompanyDetailsCard;
