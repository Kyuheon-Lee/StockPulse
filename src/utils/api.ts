import axios, { type AxiosResponse } from 'axios';
import { useSettingsStore } from '../stores/settingsStore';
import type {
    CompanyNewsItem,
    CompanyProfileData,
    MarketNewsItem,
    MarketStatusData,
    QuoteData,
    SymbolData,
} from '../types/interfaces';

const api = axios.create({
    baseURL: 'https://finnhub.io/api/v1',
    params: {},
});

api.interceptors.request.use((config) => {
    const stored = useSettingsStore.getState().finnhubApiKey?.trim();
    const token = stored || import.meta.env.VITE_FINNHUB_API_KEY;
    if (token) {
        config.params = { ...(config.params ?? {}), token };
    }
    return config;
});

export const getQuote = (symbol: string): Promise<AxiosResponse<QuoteData>> =>
    api.get('/quote', { params: { symbol } });

export const getCompanyProfile = (
    symbol: string,
): Promise<AxiosResponse<CompanyProfileData>> =>
    api.get('/stock/profile2', { params: { symbol } });

export const getMarketStatus = (): Promise<AxiosResponse<MarketStatusData>> =>
    api.get('/market/status', { params: { exchange: 'US' } });

export const searchSymbol = (
    query: string,
): Promise<AxiosResponse<SymbolData>> =>
    api.get('/search', { params: { q: query, exchange: 'US' } });

export const getMarketNews = (
    category: 'general' | 'merger',
): Promise<AxiosResponse<MarketNewsItem[]>> =>
    api.get('/news', { params: { category } });

export const getCompanyNews = (
    symbol: string,
    from: string,
    to: string,
): Promise<AxiosResponse<CompanyNewsItem[]>> =>
    api.get('/company-news', { params: { symbol, from, to } });
