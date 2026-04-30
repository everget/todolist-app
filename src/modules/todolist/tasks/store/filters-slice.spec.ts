import { describe, it, expect } from 'vitest';
import { filtersSlice, setFilterStatus, setFilterPriority } from './filters-slice';

const { reducer } = filtersSlice;

describe('filters slice', () => {
    it('starts with both filters set to all', () => {
        expect(reducer(undefined, { type: '@@INIT' })).toEqual({
            status: 'all',
            priority: 'all',
        });
    });

    it('setFilterStatus sets the status to active', () => {
        expect(reducer(undefined, setFilterStatus('active')).status).toBe('active');
    });

    it('setFilterStatus sets the status to completed', () => {
        expect(reducer(undefined, setFilterStatus('completed')).status).toBe('completed');
    });

    it('setFilterStatus resets status back to all', () => {
        const state = { status: 'completed' as const, priority: 'all' as const };
        expect(reducer(state, setFilterStatus('all')).status).toBe('all');
    });

    it('setFilterStatus does not affect the priority filter', () => {
        expect(reducer(undefined, setFilterStatus('completed')).priority).toBe('all');
    });

    it('setFilterPriority sets the priority to a specific value', () => {
        expect(reducer(undefined, setFilterPriority('high')).priority).toBe('high');
    });

    it('setFilterPriority resets priority back to all', () => {
        const state = { status: 'all' as const, priority: 'medium' as const };
        expect(reducer(state, setFilterPriority('all')).priority).toBe('all');
    });

    it('setFilterPriority does not affect the status filter', () => {
        expect(reducer(undefined, setFilterPriority('low')).status).toBe('all');
    });
});
