import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { getCompanyProfile } from '../utils/api';
import type { CompanyProfileData } from '../types/interfaces';

type CompanyProfileQuery = UseQueryResult<CompanyProfileData, Error> & {
    symbol: string;
};

export const useCompanyProfile = (symbols: string[]): CompanyProfileQuery[] => {
    const uniqueSymbols = Array.from(new Set(symbols)).filter(Boolean);
    const queries = useQueries({
        queries: uniqueSymbols.map((symbol) => ({
            queryKey: ['stock-profile', symbol],
            queryFn: async () => {
                const response = await getCompanyProfile(symbol);
                return response.data as CompanyProfileData;
            },
            enabled: Boolean(symbol),
            staleTime: Infinity,
            gcTime: 24 * 60 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
        })),
    });

    return queries.map((query, index) => ({
        ...query,
        symbol: uniqueSymbols[index],
    }));
};
