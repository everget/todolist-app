import type { ListId, TaskList, StrictOmit } from '@/types';
import type { ListRepository } from '@/modules/todolist/lists/domain/list-repository';

export class InMemoryListRepository implements ListRepository {
    private items: TaskList[] = [];

    async getAll(): Promise<TaskList[]> {
        return this.items.map((l) => ({ ...l }));
    }

    async add(list: TaskList): Promise<void> {
        this.items.push({ ...list });
    }

    async update(id: ListId, updates: Partial<StrictOmit<TaskList, 'id'>>): Promise<void> {
        const item = this.items.find((l) => l.id === id);
        if (item) Object.assign(item, updates);
    }

    async updateAll(updates: Partial<StrictOmit<TaskList, 'id'>>): Promise<void> {
        this.items.forEach((l) => Object.assign(l, updates));
    }

    async remove(id: ListId): Promise<void> {
        this.items = this.items.filter((l) => l.id !== id);
    }
}
