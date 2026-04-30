import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { I18nProvider } from '@/shared/i18n/i18n-context';
import { localeSlice } from '@/modules/preferences/store/locale-slice';
import type { Task } from '@/types';
import { TaskItem } from './task-item';

function renderItem(task: Task, onEdit = vi.fn()) {
    const store = configureStore({ reducer: { locale: localeSlice.reducer } });
    return render(
        <Provider store={store}>
            <I18nProvider locale="en">
                <TaskItem task={task} onEdit={onEdit} />
            </I18nProvider>
        </Provider>
    );
}

function makeTask(overrides: Partial<Task> = {}): Task {
    return {
        id: 't1',
        listId: 'l1',
        text: 'Write specs',
        completed: false,
        priority: 'high',
        createdAt: Date.now(),
        completedAt: null,
        estimateTime: null,
        ...overrides,
    };
}

describe('TaskItem', () => {
    it('renders the task text', () => {
        renderItem(makeTask());
        expect(screen.getByTestId('task-text')).toHaveTextContent('Write specs');
    });

    it('renders the priority label', () => {
        renderItem(makeTask());
        expect(screen.getByTestId('task-priority')).toHaveTextContent('High');
    });

    it('has an aria-label indicating active status', () => {
        renderItem(makeTask());
        expect(screen.getByTestId('task-item')).toHaveAttribute(
            'aria-label',
            'Active: Write specs'
        );
    });

    it('has an aria-label indicating completed status', () => {
        renderItem(makeTask({ completed: true }));
        expect(screen.getByTestId('task-item')).toHaveAttribute(
            'aria-label',
            'Completed: Write specs'
        );
    });

    it('calls onEdit with the task when the edit button is clicked', () => {
        const task = makeTask();
        const onEdit = vi.fn();
        renderItem(task, onEdit);
        fireEvent.click(screen.getByRole('button', { name: 'Edit Write specs' }));
        expect(onEdit).toHaveBeenCalledWith(task);
    });

    it('shows an urgent indicator when the estimate time is nearly expired', () => {
        // createdAt 10h ago, estimate 10h → remainingTime ≈ 0s < urgencyThreshold (3600s)
        renderItem(
            makeTask({
                createdAt: Date.now() - 10 * 3600 * 1000,
                estimateTime: 10 * 3600,
            })
        );
        expect(screen.getByText('Urgent')).toBeInTheDocument();
    });

    it('does not show an urgent indicator for completed tasks', () => {
        renderItem(
            makeTask({
                completed: true,
                createdAt: Date.now() - 10 * 3600 * 1000,
                estimateTime: 10 * 3600,
            })
        );
        expect(screen.queryByText('Urgent')).not.toBeInTheDocument();
    });
});
