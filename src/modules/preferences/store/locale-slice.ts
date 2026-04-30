import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Locale } from '@/types';
import { config } from '@/config/config';

export const localeSlice = createSlice({
    name: 'locale',
    initialState: config.preferences.defaults.locale as Locale,
    reducers: {
        setLocale(_state, action: PayloadAction<Locale>) {
            return action.payload;
        },
    },
});

export const { setLocale } = localeSlice.actions;
