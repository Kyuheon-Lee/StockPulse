export interface QuoteData {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
}

export interface CompanyProfileData {
    country: string;
    currency: string;
    exchange: string;
    ipo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
    logo: string;
    finnhubIndustry: string;
}

export interface MarketStatusData {
    exchange: string;
    holiday: string | null;
    isOpen: boolean;
    session: string;
    timezone: string;
    t: number;
}

export interface SymbolData {
    count: number;
    result: {
        description: string;
        displaySymbol: string;
        symbol: string;
        type: string;
    }[];
}

export interface MarketNewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export interface CompanyNewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export interface StockCardQuery {
    symbol: string;
    quote?: QuoteData;
    profile?: CompanyProfileData;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}
