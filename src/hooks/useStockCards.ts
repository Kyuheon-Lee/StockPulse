import { useMemo } from 'react';
import type {
    CompanyProfileData,
    QuoteData,
    StockCardQuery,
} from '../types/interfaces';
import { useCompanyProfile } from './useCompanyProfile';
import { useSearchQuote } from './useSearchQuote';

export const useStockCards = (symbols: string[]): StockCardQuery[] => {
    const uniqueSymbols = useMemo(
        () => Array.from(new Set(symbols)).filter(Boolean),
        [symbols],
    );
    const quoteQueries = useSearchQuote(uniqueSymbols);
    const profileQueries = useCompanyProfile(uniqueSymbols);

    return useMemo(() => {
        const quoteMap = new Map(
            quoteQueries.map((query) => [query.symbol, query]),
        );
        const profileMap = new Map(
            profileQueries.map((query) => [query.symbol, query]),
        );

        return uniqueSymbols.map((symbol) => {
            const quoteQuery = quoteMap.get(symbol);
            const profileQuery = profileMap.get(symbol);
            const error = quoteQuery?.error ?? profileQuery?.error ?? null;

            return {
                symbol,
                quote: quoteQuery?.data,
                profile: profileQuery?.data,
                isLoading:
                    (quoteQuery?.isLoading ?? false) ||
                    (profileQuery?.isLoading ?? false),
                isError:
                    (quoteQuery?.isError ?? false) ||
                    (profileQuery?.isError ?? false),
                error,
            };
        });
    }, [profileQueries, quoteQueries, uniqueSymbols]);
};
