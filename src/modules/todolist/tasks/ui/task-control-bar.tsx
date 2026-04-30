import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    markAllTasksAsCompleted,
    removeCompletedTasks,
    toggleAllTasksCompleted,
} from '@/modules/todolist/tasks/store/tasks-slice';
import { selectActiveList } from '@/modules/todolist/lists/store/lists-slice';
import { useT } from '@/shared/i18n/i18n-context';
import { Checkbox } from '@/shared/ui/checkbox';
import { TaskFilters } from '@/modules/todolist/tasks/ui/filters/task-filters';

interface TaskControlBarProps {
    allCompleted: boolean;
    noneCompleted: boolean;
}

export function TaskControlBar({ allCompleted, noneCompleted }: TaskControlBarProps) {
    const t = useT();
    const dispatch = useAppDispatch();
    const activeList = useAppSelector(selectActiveList);

    return (
        <div
            data-testid="task-control-bar"
            className="bg-background mb-4 flex flex-col items-center justify-between rounded-md px-4 py-4 text-sm shadow-md sm:flex-row"
        >
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={allCompleted}
                    onChange={(checked) =>
                        activeList &&
                        dispatch(toggleAllTasksCompleted({ listId: activeList.id, checked }))
                    }
                    ariaLabel={t('tasks.completeAll')}
                />
                <button
                    type="button"
                    disabled={allCompleted}
                    onClick={() => activeList && dispatch(markAllTasksAsCompleted(activeList.id))}
                    className="border-primary text-primary hover:bg-primary focus:ring-primary disabled:border-muted disabled:text-muted disabled:hover:text-muted rounded-md border px-4 py-1 text-sm transition-colors duration-200 hover:text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    {t('tasks.completeAll')}
                </button>
            </div>

            <TaskFilters />

            <button
                type="button"
                disabled={noneCompleted}
                onClick={() => activeList && dispatch(removeCompletedTasks(activeList.id))}
                className="border-danger text-danger hover:bg-danger focus:ring-danger disabled:border-muted disabled:text-muted disabled:hover:text-muted rounded-md border px-4 py-1 text-sm transition-colors duration-200 hover:text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
                {t('tasks.clearCompleted')}
            </button>
        </div>
    );
}
