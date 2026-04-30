import { describe, expect, it } from 'vitest';
import {
    notificationsSlice,
    addNotification,
    removeNotification,
    selectNotifications,
    type NotificationsState,
} from './notifications-slice';

const { reducer } = notificationsSlice;
const empty: NotificationsState = { items: [] };

describe('notifications slice', () => {
    it('starts with no notifications', () => {
        expect(reducer(undefined, { type: '@@INIT' }).items).toEqual([]);
    });

    it('addNotification appends a notification with the correct message and type', () => {
        const state = reducer(empty, addNotification({ message: 'Saved', type: 'success' }));
        expect(state.items).toHaveLength(1);
        expect(state.items[0].message).toBe('Saved');
        expect(state.items[0].type).toBe('success');
    });

    it('addNotification assigns a non-empty id', () => {
        const state = reducer(empty, addNotification({ message: 'Oops', type: 'error' }));
        expect(state.items[0].id).toBeTruthy();
    });

    it('addNotification stacks multiple notifications', () => {
        let state = reducer(empty, addNotification({ message: 'First', type: 'info' }));
        state = reducer(state, addNotification({ message: 'Second', type: 'success' }));
        expect(state.items).toHaveLength(2);
        expect(state.items[1].message).toBe('Second');
    });

    it('removeNotification removes the notification with the given id', () => {
        let state = reducer(empty, addNotification({ message: 'Hello', type: 'info' }));
        const { id } = state.items[0];
        state = reducer(state, removeNotification(id));
        expect(state.items).toHaveLength(0);
    });

    it('removeNotification with an unknown id changes nothing', () => {
        const state = reducer(empty, addNotification({ message: 'Hello', type: 'info' }));
        expect(reducer(state, removeNotification('no-such-id')).items).toHaveLength(1);
    });

    it('removeNotification only removes the matching notification', () => {
        let state = reducer(empty, addNotification({ message: 'A', type: 'info' }));
        state = reducer(state, addNotification({ message: 'B', type: 'error' }));
        const idA = state.items[0].id;
        state = reducer(state, removeNotification(idA));
        expect(state.items).toHaveLength(1);
        expect(state.items[0].message).toBe('B');
    });

    it('selectNotifications returns the items array', () => {
        const item = { id: '1', message: 'Hi', type: 'info' as const };
        expect(selectNotifications({ notifications: { items: [item] } })).toEqual([item]);
    });
});
