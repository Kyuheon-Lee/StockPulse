import type { TabKey } from '../../types/tabs';
import logo from '../../assets/logo.jpg';
import CategoryTabs from '../categoryTabs/categoryTabs';
import SearchBar from '../searchBar/searchBar';
import styles from './header.module.scss';

interface HeaderProps {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
}

function Header({ activeTab, onTabChange }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.brandRow}>
                    <img
                        className={styles.logo}
                        src={logo}
                        alt="StockPulse Logo"
                        loading="eager"
                    />
                    <h1>StockPulse</h1>
                </div>
                <CategoryTabs activeTab={activeTab} onTabChange={onTabChange} />
                {activeTab !== 'settings' && (
                    <div className={styles.searchBarWrapper}>
                        <SearchBar placeholder="티커 또는 종목명 검색" />
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
