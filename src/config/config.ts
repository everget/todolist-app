import type {
    Locale,
    Preferences,
    TaskFilterPriority,
    TaskFilterStatus,
    TaskPriority,
    Theme,
} from '@/types';

export const config = {
    tasks: {
        urgencyThresholdInSeconds: 3600,
        validPriorities: [
            'none',
            'high',
            'medium',
            'low',
        ] as const satisfies readonly TaskPriority[],
    },

    notifications: {
        autoHideDurationInMs: 5000,
    },
    storage: {
        dataKey: 'todolistapp++:data',
        preferencesKey: 'todolistapp++:preferences',
        simulatedLatencyInMs: 300,
    },
    validation: {
        listNameMaxLength: 100,
        taskTextMaxLength: 500,
    },
    preferences: {
        defaults: {
            theme: 'dark',
            locale: 'en',
            filters: {
                status: 'all',
                priority: 'all',
            },
        } satisfies Preferences,
        validThemes: ['light', 'dark'] as const satisfies readonly Theme[],
        validLocales: ['en', 'pt-br', 'es', 'ua', 'ru'] as const satisfies readonly Locale[],
        validFilterStatuses: [
            'all',
            'active',
            'completed',
        ] as const satisfies readonly TaskFilterStatus[],
        validFilterPriorities: [
            'all',
            'high',
            'medium',
            'low',
            'none',
        ] as const satisfies readonly TaskFilterPriority[],
    },
} as const;
