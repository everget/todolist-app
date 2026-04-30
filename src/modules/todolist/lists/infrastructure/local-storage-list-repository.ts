import { config } from '@/config/config';
import { readStorage, writeStorage } from '@/infrastructure/local-storage-store';
import { sleep } from '@/shared/utils/sleep';
import type { ListRepository } from '@/modules/todolist/lists/domain/list-repository';
import type { ListId, StrictOmit, TaskList } from '@/types';

export class LocalStorageListRepository implements ListRepository {
    async getAll(): Promise<TaskList[]> {
        await sleep(config.storage.simulatedLatencyInMs);
        return readStorage().lists;
    }

    async add(list: TaskList): Promise<void> {
        const data = readStorage();
        data.lists.push(list);
        writeStorage(data);
    }

    async update(id: ListId, updates: Partial<StrictOmit<TaskList, 'id'>>): Promise<void> {
        const data = readStorage();
        const item = data.lists.find((l) => l.id === id);
        if (item) Object.assign(item, updates);
        writeStorage(data);
    }

    async updateAll(updates: Partial<StrictOmit<TaskList, 'id'>>): Promise<void> {
        const data = readStorage();
        data.lists.forEach((l) => Object.assign(l, updates));
        writeStorage(data);
    }

    async remove(id: ListId): Promise<void> {
        const data = readStorage();
        data.lists = data.lists.filter((l) => l.id !== id);
        writeStorage(data);
    }
}
