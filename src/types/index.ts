export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type HydrationStatus = 'loading' | 'ready' | 'error';

export type Locale = 'en' | 'pt-br' | 'es' | 'ua' | 'ru';

export type Theme = 'light' | 'dark';

export type TaskPriority = 'high' | 'medium' | 'low' | 'none';
export type TaskFilterPriority = 'all' | TaskPriority;

export type TaskStatus = 'active' | 'completed';
export type TaskFilterStatus = 'all' | TaskStatus;

export type TaskFilters = {
    status: TaskFilterStatus;
    priority: TaskFilterPriority;
};

export interface Preferences {
    theme: Theme;
    locale: Locale;
    filters: TaskFilters;
}

// Primitive aliases for semantic clarity and IDE discoverability.
export type EpochMs = number;
export type EpochSec = number;
export type TaskId = string;
export type ListId = string;

export interface Task {
    id: TaskId;
    listId: ListId;
    text: string;
    completed: boolean;
    priority: TaskPriority;
    createdAt: EpochMs;
    completedAt: EpochMs | null;
    // Time values are stored as seconds; formatting is done at the presentation layer.
    estimateTime: EpochSec | null;
}

export interface TaskList {
    id: ListId;
    name: string;
    isActive: boolean;
}

export interface AppState {
    theme: Theme;
    locale: Locale;
    lists: TaskList[];
    tasks: Task[];
    filters: TaskFilters;
}
