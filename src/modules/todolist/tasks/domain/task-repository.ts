import type { ListId, Task, TaskId } from '@/types';

export type TaskUpdates = Partial<Omit<Task, 'id' | 'listId'>>;

export interface TaskRepository {
    getAll(): Promise<Task[]>;
    add(task: Task): Promise<void>;
    update(id: TaskId, updates: TaskUpdates): Promise<void>;
    remove(id: TaskId): Promise<void>;
    // Cascade: called explicitly when a list is deleted so in-memory and PGlite
    // adapters stay consistent (PGlite FK cascade handles the DB side; this call
    // is a safe no-op there).
    removeByListId(listId: ListId): Promise<void>;
    removeCompleted(listId: ListId): Promise<void>;
    // Bulk updates scoped to a list - used by toggleAll and markAllCompleted.
    updateAll(listId: ListId, updates: TaskUpdates): Promise<void>;
    updateIncomplete(listId: ListId, updates: TaskUpdates): Promise<void>;
}
