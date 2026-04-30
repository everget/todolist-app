import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TaskFilterPriority, type TaskFilters, type TaskFilterStatus } from '@/types';

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        status: 'all',
        priority: 'all',
    } as TaskFilters,
    reducers: {
        setFilterStatus(state, action: PayloadAction<TaskFilterStatus>) {
            state.status = action.payload;
        },
        setFilterPriority(state, action: PayloadAction<TaskFilterPriority>) {
            state.priority = action.payload;
        },
    },
});

export const { setFilterStatus, setFilterPriority } = filtersSlice.actions;
