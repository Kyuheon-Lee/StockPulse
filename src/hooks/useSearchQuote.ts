import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { getQuote } from '../utils/api';
import type { QuoteData } from '../types/interfaces';

type QuoteQuery = UseQueryResult<QuoteData, Error> & { symbol: string };

export const useSearchQuote = (symbols: string[]): QuoteQuery[] => {
    const uniqueSymbols = Array.from(new Set(symbols)).filter(Boolean);
    const queries = useQueries({
        queries: uniqueSymbols.map((symbol) => ({
            queryKey: ['quote', symbol],
            queryFn: async () => {
                const response = await getQuote(symbol);
                return response.data as QuoteData;
            },
            enabled: Boolean(symbol),
            staleTime: 1000 * 15,
        })),
    });

    return queries.map((query, index) => ({
        ...query,
        symbol: uniqueSymbols[index],
    }));
};
