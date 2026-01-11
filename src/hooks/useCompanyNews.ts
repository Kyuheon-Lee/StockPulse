import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getCompanyNews } from '../utils/api';
import type { CompanyNewsItem } from '../types/interfaces';

export type CompanyNewsEntry = CompanyNewsItem & { symbol: string };

type CompanyNewsState = {
    items: CompanyNewsEntry[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
};

const getDateRange = () => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);

    const format = (date: Date) => date.toISOString().slice(0, 10);

    return {
        from: format(fromDate),
        to: format(toDate),
    };
};

export const useCompanyNews = (symbols: string[]): CompanyNewsState => {
    const uniqueSymbols = useMemo(
        () =>
            Array.from(new Set(symbols.map((symbol) => symbol.toUpperCase()))),
        [symbols],
    );
    const { from, to } = getDateRange();

    const queries = useQueries({
        queries: uniqueSymbols.map((symbol) => ({
            queryKey: ['company-news', symbol, from, to],
            queryFn: async () => {
                const response = await getCompanyNews(symbol, from, to);
                return response.data;
            },
            enabled: Boolean(symbol),
            staleTime: 1000 * 60 * 5, // 5분
        })),
    });

    return useMemo(() => {
        const items = queries.flatMap((query, index) => {
            const symbol = uniqueSymbols[index];
            return (query.data ?? []).map((item) => ({
                ...item,
                symbol,
            }));
        });
        items.sort((a, b) => b.datetime - a.datetime);

        return {
            items: items.slice(0, 8),
            isLoading: queries.some((query) => query.isLoading),
            isError: queries.some((query) => query.isError),
            error: queries.find((query) => query.error)?.error ?? null,
        };
    }, [queries, uniqueSymbols]);
};
