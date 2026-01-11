import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMarketNews } from '../utils/api';
import type { MarketNewsItem } from '../types/interfaces';

type MarketNewsQuery = UseQueryResult<MarketNewsItem[], Error>;

export const useMarketNews = (
    category: 'general' | 'merger',
): MarketNewsQuery =>
    useQuery({
        queryKey: ['market-news', category],
        queryFn: async () => {
            const response = await getMarketNews(category);
            return response.data;
        },
        staleTime: 1000 * 60 * 60, // 1시간
    });
