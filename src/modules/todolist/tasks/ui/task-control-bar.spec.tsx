import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { listsSlice } from '@/modules/todolist/lists/store/lists-slice';
import { tasksSlice } from '@/modules/todolist/tasks/store/tasks-slice';
import { filtersSlice } from '@/modules/todolist/tasks/store/filters-slice';
import { TaskControlBar } from './task-control-bar';

function renderBar(allCompleted = false, noneCompleted = true) {
    const store = configureStore({
        reducer: {
            lists: listsSlice.reducer,
            tasks: tasksSlice.reducer,
            filters: filtersSlice.reducer,
        },
    });
    return render(
        <Provider store={store}>
            <I18nProvider locale="en">
                <TaskControlBar allCompleted={allCompleted} noneCompleted={noneCompleted} />
            </I18nProvider>
        </Provider>
    );
}

describe('TaskControlBar', () => {
    it('renders the control bar', () => {
        renderBar();
        expect(screen.getByTestId('task-control-bar')).toBeInTheDocument();
    });

    it('renders the complete-all button', () => {
        renderBar();
        expect(screen.getByRole('button', { name: 'Complete all' })).toBeInTheDocument();
    });

    it('renders the clear-completed button', () => {
        renderBar();
        expect(screen.getByRole('button', { name: 'Clear completed' })).toBeInTheDocument();
    });

    it('disables the complete-all button when all tasks are already completed', () => {
        renderBar(true);
        expect(screen.getByRole('button', { name: 'Complete all' })).toBeDisabled();
    });

    it('enables the complete-all button when not all tasks are completed', () => {
        renderBar(false);
        expect(screen.getByRole('button', { name: 'Complete all' })).toBeEnabled();
    });

    it('disables the clear-completed button when there are no completed tasks', () => {
        renderBar(false, true);
        expect(screen.getByRole('button', { name: 'Clear completed' })).toBeDisabled();
    });

    it('enables the clear-completed button when there are completed tasks', () => {
        renderBar(false, false);
        expect(screen.getByRole('button', { name: 'Clear completed' })).toBeEnabled();
    });

    it('renders the task filters', () => {
        renderBar();
        expect(screen.getByTestId('task-filters')).toBeInTheDocument();
    });
});
