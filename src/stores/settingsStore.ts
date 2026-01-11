import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsState = {
    finnhubApiKey: string;
    setFinnhubApiKey: (key: string) => void;
    clearFinnhubApiKey: () => void;
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            finnhubApiKey: '',
            setFinnhubApiKey: (key) =>
                set({ finnhubApiKey: key.trim() }),
            clearFinnhubApiKey: () => set({ finnhubApiKey: '' }),
        }),
        { name: 'stock-pulse-settings' },
    ),
);
