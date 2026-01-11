export const formatNumber = (value?: number, decimals = 2) => {
    if (value === undefined || Number.isNaN(value)) {
        return '--';
    }
    return value.toFixed(decimals);
};

export const formatCurrency = (value?: number, decimals = 2) => {
    if (value === undefined || Number.isNaN(value)) {
        return '--';
    }
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const formatPercent = (value?: number, decimals = 2) => {
    if (value === undefined || Number.isNaN(value)) {
        return '--';
    }
    return `${value.toFixed(decimals)}%`;
};

export const formatSignedCurrency = (value?: number, decimals = 2) => {
    if (value === undefined || Number.isNaN(value)) {
        return '--';
    }
    return `${value >= 0 ? '+' : ''}${formatCurrency(value, decimals)}`;
};

export const formatSignedPercent = (value?: number, decimals = 2) => {
    if (value === undefined || Number.isNaN(value)) {
        return '--';
    }
    return `${value >= 0 ? '+' : ''}${formatPercent(value, decimals)}`;
};
