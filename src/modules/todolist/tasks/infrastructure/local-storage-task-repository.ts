import { config } from '@/config/config';
import { readStorage, writeStorage } from '@/infrastructure/local-storage-store';
import { sleep } from '@/shared/utils/sleep';
import type { TaskRepository, TaskUpdates } from '@/modules/todolist/tasks/domain/task-repository';
import type { ListId, Task, TaskId } from '@/types';

export class LocalStorageTaskRepository implements TaskRepository {
    async getAll(): Promise<Task[]> {
        await sleep(config.storage.simulatedLatencyInMs);
        return readStorage().tasks;
    }

    async add(task: Task): Promise<void> {
        const data = readStorage();
        data.tasks.push(task);
        writeStorage(data);
    }

    async update(id: TaskId, updates: TaskUpdates): Promise<void> {
        const data = readStorage();
        const item = data.tasks.find((t) => t.id === id);
        if (item) Object.assign(item, updates);
        writeStorage(data);
    }

    async remove(id: TaskId): Promise<void> {
        const data = readStorage();
        data.tasks = data.tasks.filter((t) => t.id !== id);
        writeStorage(data);
    }

    async removeByListId(listId: ListId): Promise<void> {
        const data = readStorage();
        data.tasks = data.tasks.filter((t) => t.listId !== listId);
        writeStorage(data);
    }

    async removeCompleted(listId: ListId): Promise<void> {
        const data = readStorage();
        data.tasks = data.tasks.filter((t) => !(t.listId === listId && t.completed));
        writeStorage(data);
    }

    async updateAll(listId: ListId, updates: TaskUpdates): Promise<void> {
        const data = readStorage();
        data.tasks.forEach((t) => {
            if (t.listId === listId) Object.assign(t, updates);
        });
        writeStorage(data);
    }

    async updateIncomplete(listId: ListId, updates: TaskUpdates): Promise<void> {
        const data = readStorage();
        data.tasks.forEach((t) => {
            if (t.listId === listId && !t.completed) Object.assign(t, updates);
        });
        writeStorage(data);
    }
}
