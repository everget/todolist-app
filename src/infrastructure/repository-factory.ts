import type { AppThunkExtra } from '@/store/thunk-extra';
import { LocalStorageListRepository } from '@/modules/todolist/lists/infrastructure/local-storage-list-repository';
import { LocalStorageTaskRepository } from '@/modules/todolist/tasks/infrastructure/local-storage-task-repository';
import { InMemoryListRepository } from '@/modules/todolist/lists/infrastructure/in-memory-list-repository';
import { InMemoryTaskRepository } from '@/modules/todolist/tasks/infrastructure/in-memory-task-repository';
import { LocalStoragePreferencesRepository } from '@/modules/preferences/infrastructure/local-storage-preferences-repository';
import { InMemoryPreferencesRepository } from '@/modules/preferences/infrastructure/in-memory-preferences-repository';

export function createLocalStorageRepositories(): AppThunkExtra {
    return {
        listRepo: new LocalStorageListRepository(),
        taskRepo: new LocalStorageTaskRepository(),
        preferencesRepo: new LocalStoragePreferencesRepository(),
    };
}

// Tests / isolated stories: adapters backed by plain arrays, no I/O required
export function createInMemoryRepositories(): AppThunkExtra {
    return {
        listRepo: new InMemoryListRepository(),
        taskRepo: new InMemoryTaskRepository(),
        preferencesRepo: new InMemoryPreferencesRepository(),
    };
}
