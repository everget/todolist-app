import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Theme } from '@/types';
import { config } from '@/config/config';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: config.preferences.defaults.theme as Theme,
    reducers: {
        setTheme(_state, action: PayloadAction<Theme>) {
            return action.payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;
