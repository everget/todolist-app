import type { ListId, Task, TaskId } from '@/types';
import type { TaskRepository, TaskUpdates } from '@/modules/todolist/tasks/domain/task-repository';

export class InMemoryTaskRepository implements TaskRepository {
    private items: Task[] = [];

    async getAll(): Promise<Task[]> {
        return this.items.map((t) => ({ ...t }));
    }

    async add(task: Task): Promise<void> {
        this.items.push({ ...task });
    }

    async update(id: TaskId, updates: TaskUpdates): Promise<void> {
        const item = this.items.find((t) => t.id === id);
        if (item) Object.assign(item, updates);
    }

    async remove(id: TaskId): Promise<void> {
        this.items = this.items.filter((t) => t.id !== id);
    }

    async removeByListId(listId: ListId): Promise<void> {
        this.items = this.items.filter((t) => t.listId !== listId);
    }

    async removeCompleted(listId: ListId): Promise<void> {
        this.items = this.items.filter((t) => !(t.listId === listId && t.completed));
    }

    async updateAll(listId: ListId, updates: TaskUpdates): Promise<void> {
        this.items.forEach((t) => {
            if (t.listId === listId) Object.assign(t, updates);
        });
    }

    async updateIncomplete(listId: ListId, updates: TaskUpdates): Promise<void> {
        this.items.forEach((t) => {
            if (t.listId === listId && !t.completed) Object.assign(t, updates);
        });
    }
}
