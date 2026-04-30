import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    addTask,
    editTask,
    selectActiveListTasks,
    selectFilteredTasks,
    selectRemainingTasksCount,
} from '@/modules/todolist/tasks/store/tasks-slice';
import { selectActiveList } from '@/modules/todolist/lists/store/lists-slice';
import { useT } from '@/shared/i18n/i18n-context';
import { type Task, type TaskPriority } from '@/types';
import { AddButton } from '@/modules/todolist/shared/ui/buttons/add-button';
import { CancelButton } from '@/modules/todolist/shared/ui/buttons/cancel-button';
import { EstimateTimeSelect } from '@/modules/todolist/shared/ui/selects/estimate-time-select';
import { ListHeader } from '@/modules/todolist/shared/ui/list-header';
import { PrioritySelect } from '@/modules/todolist/shared/ui/selects/priority-select';
import { TextInput } from '@/shared/ui/text-input';
import { EmptyContentIcon } from '@/shared/ui/empty-content-icon';
import { TaskControlBar } from './task-control-bar';
import { TaskListHeader } from './task-list-header';
import { TaskItem } from './task-item';

import { config } from '@/config/config';

type FormState = {
    text: string;
    priority: TaskPriority;
    estimateTime: number | null;
    editingTask: Task | null;
};

const FORM_DEFAULTS: FormState = {
    text: '',
    priority: 'none',
    estimateTime: null,
    editingTask: null,
};

export function TaskList() {
    const t = useT();
    const dispatch = useAppDispatch();

    const activeList = useAppSelector(selectActiveList);
    const allActiveTasks = useAppSelector(selectActiveListTasks);
    const filteredTasks = useAppSelector(selectFilteredTasks);
    const remainingCount = useAppSelector(selectRemainingTasksCount);

    const inputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<FormState>(FORM_DEFAULTS);

    const completedCount = allActiveTasks.filter((t) => t.completed).length;
    const totalCount = allActiveTasks.length;
    const allCompleted = totalCount > 0 && completedCount === totalCount;
    const noneCompleted = completedCount === 0;

    const addLabel = t('actions.add');
    const updateLabel = t('actions.update');
    const buttonLabel = form.editingTask ? updateLabel : addLabel;

    function handleSubmit() {
        const text = form.text.trim();
        if (!text || !activeList) return;

        if (form.editingTask) {
            dispatch(
                editTask({
                    id: form.editingTask.id,
                    text,
                    priority: form.priority,
                    estimateTime: form.estimateTime,
                })
            );
        } else {
            dispatch(
                addTask({
                    id: crypto.randomUUID(),
                    listId: activeList.id,
                    text,
                    completed: false,
                    priority: form.priority,
                    createdAt: Date.now(),
                    completedAt: null,
                    estimateTime: form.estimateTime,
                })
            );
        }

        setForm(FORM_DEFAULTS);
        inputRef.current?.focus();
    }

    function handleEditTask(task: Task) {
        setForm({
            text: task.text,
            priority: task.priority,
            estimateTime: task.estimateTime,
            editingTask: task,
        });
        inputRef.current?.focus();
    }

    function handleCancelEdit() {
        setForm(FORM_DEFAULTS);
        inputRef.current?.focus();
    }

    return (
        <div>
            <ListHeader
                text={t('tasks.tasks')}
                textSecondPart={activeList?.name ?? t('lists.noListSelected')}
            />

            <div className="mb-4 flex items-center gap-2">
                <div className="flex-1">
                    <TextInput
                        ref={inputRef}
                        value={form.text}
                        onChange={(text) => setForm((f) => ({ ...f, text }))}
                        ariaLabel={form.editingTask ? t('tasks.edit') : t('tasks.new')}
                        placeholder={t('tasks.inputPlaceholder')}
                        onEnter={handleSubmit}
                        testId="new-task-input"
                        maxLength={config.validation.taskTextMaxLength}
                    />
                </div>
                <div className="flex shrink-0 gap-2">
                    <AddButton label={buttonLabel} onClick={handleSubmit} />
                    {form.editingTask && (
                        <CancelButton label={t('actions.cancel')} onClick={handleCancelEdit} />
                    )}
                </div>
            </div>

            <div className="mb-4 flex gap-2">
                <div className="flex-1">
                    <PrioritySelect
                        value={form.priority}
                        onChange={(priority) => setForm((f) => ({ ...f, priority }))}
                    />
                </div>
                <div className="flex-1">
                    <EstimateTimeSelect
                        value={form.estimateTime}
                        onChange={(estimateTime) => setForm((f) => ({ ...f, estimateTime }))}
                    />
                </div>
            </div>

            <TaskControlBar allCompleted={allCompleted} noneCompleted={noneCompleted} />

            <TaskListHeader />

            <ul role="list" aria-label={t('tasks.tasks')} className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <li>
                        <EmptyContentIcon title={t('tasks.noTasks')} />
                    </li>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
                    ))
                )}
            </ul>

            {totalCount > 0 && (
                <p className="text-muted mt-4 text-center text-sm">
                    {remainingCount} {t('tasks.left')}
                </p>
            )}
        </div>
    );
}
