import { config } from '@/config/config';
import type { Task, TaskList } from '@/types';

export interface AppStorageData {
    lists: TaskList[];
    tasks: Task[];
}

export function readStorage(): AppStorageData {
    const fallbackData = {
        lists: [],
        tasks: [],
    };

    try {
        const raw = localStorage.getItem(config.storage.dataKey);
        if (!raw) return fallbackData;
        return JSON.parse(raw) as AppStorageData;
    } catch {
        return fallbackData;
    }
}

export function writeStorage(data: AppStorageData): void {
    localStorage.setItem(config.storage.dataKey, JSON.stringify(data));
}
