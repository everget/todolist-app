import type { ListId, TaskList, StrictOmit } from '@/types';

export interface ListRepository {
    getAll(): Promise<TaskList[]>;
    add(list: TaskList): Promise<void>;
    update(id: ListId, updates: Partial<StrictOmit<TaskList, 'id'>>): Promise<void>;
    // Used by setActiveList to deactivate every list in one step.
    updateAll(updates: Partial<StrictOmit<TaskList, 'id'>>): Promise<void>;
    remove(id: ListId): Promise<void>;
}
