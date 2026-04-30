import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

export interface NotificationsState {
    items: Notification[];
}

const initialState: NotificationsState = {
    items: [],
};

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Omit<Notification, 'id'>>) {
            state.items.push({
                ...action.payload,
                id: crypto.randomUUID(),
            });
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export const selectNotifications = (state: { notifications: NotificationsState }) =>
    state.notifications.items;
