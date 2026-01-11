import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { searchSymbol } from '../utils/api';
import type { SymbolData } from '../types/interfaces';

type SymbolQuery = UseQueryResult<SymbolData, Error>;

export const useSearchSymbol = (query: string): SymbolQuery => {
    const symbolQuery = useQuery({
        queryKey: ['symbol', query],
        queryFn: async () => {
            const response = await searchSymbol(query);
            return response.data;
        },
        enabled: Boolean(query),
    });
    return symbolQuery;
};
