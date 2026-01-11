import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/global.scss';
import App from './App.tsx';
import DashboardPage from './pages/dashboard/dashboard';
import HomePage from './pages/home/home';
import PortfolioPage from './pages/portfolio/portfolio';
import SettingsPage from './pages/settings/settings';
import WatchlistPage from './pages/watchlist/watchlist';

const queryClient = new QueryClient();
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'watchlist', element: <WatchlistPage /> },
            { path: 'portfolio', element: <PortfolioPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'settings', element: <SettingsPage /> },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>,
);
