import { TaskList } from '@/modules/todolist/tasks/ui/task-list';

export function TasksPanel() {
    return (
        <section data-testid="tasks-panel" className="w-full md:w-3/4">
            <TaskList />
        </section>
    );
}
