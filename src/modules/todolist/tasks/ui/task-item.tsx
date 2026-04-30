import ms from 'ms';
import { clsx } from 'clsx';
import { config } from '@/config/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { editTask, removeTask } from '@/modules/todolist/tasks/store/tasks-slice';
import { useT } from '@/shared/i18n/i18n-context';
import { formatDate } from '@/shared/i18n/format-date';
import { type Task, type TaskPriority } from '@/types';
import { Checkbox } from '@/shared/ui/checkbox';
import { EditButton } from '@/modules/todolist/shared/ui/buttons/edit-button';
import { RemoveButton } from '@/modules/todolist/shared/ui/buttons/remove-button';

interface TaskAttributeProps {
    title: string;
    value: string | null;
    valueClassName?: string;
    testId?: string;
}

function TaskAttribute({ title, value, valueClassName, testId }: TaskAttributeProps) {
    return (
        <div data-testid={testId} className="text-muted flex gap-1 text-sm">
            <span className="font-medium md:hidden">{title}: </span>
            <span className={clsx('truncate', valueClassName)}>{value}</span>
        </div>
    );
}

function getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
        case 'high':
            return 'text-danger';
        case 'medium':
            return 'text-warning';
        case 'low':
            return 'text-success';
        default:
            return 'text-muted';
    }
}

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
    const t = useT();
    const dispatch = useAppDispatch();
    const locale = useAppSelector((state) => state.locale);

    const { id, text, completed, priority, createdAt, completedAt, estimateTime } = task;

    const remainingTime =
        estimateTime !== null
            ? Math.max(0, Math.floor((createdAt + estimateTime * 1000 - Date.now()) / 1000))
            : null;

    const isUrgent =
        !completed &&
        remainingTime !== null &&
        remainingTime < config.tasks.urgencyThresholdInSeconds;

    function handleCheck(checked: boolean) {
        dispatch(editTask({ id, completed: checked, completedAt: checked ? Date.now() : null }));
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCheck(!completed);
        }
    }

    return (
        <li
            data-testid="task-item"
            data-task-id={id}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label={`${completed ? t('tasks.status.completed') : t('tasks.status.active')}: ${text}`}
            className={clsx(
                'group relative flex flex-col items-start justify-between gap-4 rounded-md bg-background p-4 shadow-sm outline-none focus:ring-2 focus:ring-primary md:flex-row md:items-center md:gap-0',
                'transition-shadow duration-300 ease-in-out hover:shadow-md',
                'border-l-4',
                isUrgent ? 'border-danger' : 'border-transparent'
            )}
        >
            {isUrgent && <span className="sr-only">{t('tasks.urgent')}</span>}
            <div className="flex w-full min-w-0 items-center gap-4 md:w-5/12">
                <div className="flex shrink-0 items-center">
                    <Checkbox
                        checked={completed}
                        onChange={handleCheck}
                        ariaLabel={`${t('tasks.status.toggle')} ${text}`}
                    />
                </div>
                <p data-testid="task-text" className="truncate font-medium">
                    {text}
                </p>
            </div>

            <div className="text-muted grid w-full grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:w-7/12 md:grid-cols-4 md:px-2">
                <TaskAttribute
                    title={t('tasks.priority.label')}
                    value={t(`tasks.priority.${priority}`)}
                    valueClassName={getPriorityColor(priority)}
                    testId="task-priority"
                />
                <TaskAttribute
                    title={t('tasks.estimateTime')}
                    value={estimateTime == null ? t('none') : ms(estimateTime * 1000)}
                />
                <TaskAttribute
                    title={t('tasks.createdAt')}
                    value={formatDate(new Date(createdAt), locale)}
                />
                <TaskAttribute
                    title={t('tasks.completedAt')}
                    value={completedAt ? formatDate(new Date(completedAt), locale) : '-'}
                />
            </div>

            <div className="md:bg-background flex w-full shrink-0 flex-wrap items-center justify-end gap-2 transition-opacity md:absolute md:top-1/2 md:right-4 md:w-auto md:-translate-y-1/2 md:pl-2 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
                <EditButton label={`${t('actions.edit')} ${text}`} onClick={() => onEdit(task)} />
                <RemoveButton
                    label={`${t('actions.remove')} ${text}`}
                    onClick={() => dispatch(removeTask(id))}
                />
            </div>
        </li>
    );
}
