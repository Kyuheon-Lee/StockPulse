import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ApiKeyNotice from './components/apiKeyNotice/apiKeyNotice';
import { useFinnhubToken } from './hooks/useFinnhubToken';
import Header from './components/header/header';
import type { TabKey } from './types/tabs';
import styles from './App.module.scss';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = getActiveTab(location.pathname);
    const token = useFinnhubToken();
    const isSettings = location.pathname === '/settings';

    const handleTabChange = (tab: TabKey) => {
        navigate(tab === 'home' ? '/' : `/${tab}`);
    };

    return (
        <div className={styles.app}>
            <Header activeTab={activeTab} onTabChange={handleTabChange} />

            <main className={styles.mainContent}>
                {token || isSettings ? (
                    <Outlet />
                ) : (
                    <ApiKeyNotice variant="standalone" />
                )}
            </main>
        </div>
    );
}

function getActiveTab(pathname: string): TabKey {
    if (pathname === '/' || pathname === '') {
        return 'home';
    }

    const key = pathname.replace('/', '');

    if (
        key === 'watchlist' ||
        key === 'portfolio' ||
        key === 'dashboard' ||
        key === 'settings'
    ) {
        return key;
    }

    return 'home';
}

export default App;
