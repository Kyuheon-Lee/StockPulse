import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMarketStatus } from '../utils/api';
import type { MarketStatusData } from '../types/interfaces';
import { useMemo } from 'react';

type MarketStatusQuery = UseQueryResult<MarketStatusData, Error>;

export const useMarketStatus = (): MarketStatusQuery => {
    const query = useQuery({
        queryKey: ['market-status'],
        queryFn: async () => {
            const response = await getMarketStatus();
            return response.data as MarketStatusData;
        },
        enabled: true,
        staleTime: 60000, // 1분
        refetchInterval: 60000, // 1분
        refetchOnWindowFocus: true,
        retry: 2,
        gcTime: 600000, // 10분
    });
    return useMemo(() => query, [query]);
};
