import type { ListRepository } from '@/modules/todolist/lists/domain/list-repository';
import type { TaskRepository } from '@/modules/todolist/tasks/domain/task-repository';
import type { PreferencesRepository } from '@/modules/preferences/domain/preferences-repository';

export interface AppThunkExtra {
    listRepo: ListRepository;
    taskRepo: TaskRepository;
    preferencesRepo: PreferencesRepository;
}

// Shorthand for the thunk config object used in createAsyncThunk generics.
export type AppThunkConfig = { extra: AppThunkExtra };
