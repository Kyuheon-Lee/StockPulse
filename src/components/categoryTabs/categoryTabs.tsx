import { useMarketStatus } from '../../hooks/useMarketStatus';
import type { TabKey } from '../../types/tabs';
import styles from './CategoryTabs.module.scss';

interface CategoryTabsProps {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: '홈' },
    { key: 'watchlist', label: '관심' },
    { key: 'portfolio', label: '나의 주식' },
    { key: 'dashboard', label: '대시보드' },
    { key: 'settings', label: '설정' },
];

function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
    const marketStatus = useMarketStatus();
    const marketStatusBadge = getMarketStatusBadge(marketStatus);

    return (
        <nav className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
                    onClick={() => onTabChange(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
            <div className={styles.marketStatus}>
                <div
                    className={`${styles.statusPill} ${marketStatusBadge.className}`}
                >
                    {marketStatusBadge.label}
                </div>
            </div>
        </nav>
    );
}

function getMarketStatusBadge(
    marketStatus: ReturnType<typeof useMarketStatus>,
) {
    if (marketStatus.isLoading) {
        return { label: '로딩 중', className: styles.statusClosed };
    }

    if (marketStatus.isError || !marketStatus.data) {
        return { label: '사용 불가', className: styles.statusClosed };
    }

    const session = marketStatus.data.session?.toLowerCase() ?? '';
    const isPreMarket = session.includes('pre');

    if (marketStatus.data.isOpen) {
        return { label: '개장', className: styles.statusOpen };
    }

    if (isPreMarket) {
        return { label: '개장 전', className: styles.statusPreMarket };
    }

    return { label: '휴장', className: styles.statusClosed };
}

export default CategoryTabs;
