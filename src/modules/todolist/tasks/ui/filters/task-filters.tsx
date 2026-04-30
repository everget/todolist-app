import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilterStatus } from '@/modules/todolist/tasks/store/filters-slice';
import {
    selectActiveTasksCount,
    selectCompletedTasksCount,
    selectRemainingTasksCount,
} from '@/modules/todolist/tasks/store/tasks-slice';
import { useT } from '@/shared/i18n/i18n-context';
import { type TaskFilterStatus } from '@/types';

interface FilterButtonProps {
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

export function FilterButton({ label, active, disabled, onClick, children }: FilterButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={onClick}
            className={clsx(
                'rounded-md border border-transparent px-4 py-1 transition-colors duration-300',
                'hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary',
                'active:border-primary active:bg-primary active:text-white',
                active && 'bg-secondary'
            )}
        >
            {label}
            {children}
        </button>
    );
}

export function TaskFilters() {
    const t = useT();
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.filters);
    const totalCount = useAppSelector(selectActiveTasksCount);
    const remaining = useAppSelector(selectRemainingTasksCount);
    const completedCount = useAppSelector(selectCompletedTasksCount);

    const statuses: { value: TaskFilterStatus; label: string; count: number }[] = [
        { value: 'all', label: t('tasks.filter.all'), count: totalCount },
        { value: 'active', label: t('tasks.filter.active'), count: remaining },
        { value: 'completed', label: t('tasks.filter.completed'), count: completedCount },
    ];

    return (
        <div data-testid="task-filters" className="my-2 flex space-x-4 sm:my-0">
            {statuses.map(({ value, label, count }) => (
                <FilterButton
                    key={value}
                    label={`${label} (${count})`}
                    active={filters.status === value}
                    onClick={() => dispatch(setFilterStatus(value))}
                />
            ))}
        </div>
    );
}
