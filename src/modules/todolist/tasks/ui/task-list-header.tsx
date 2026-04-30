import { useT } from '@/shared/i18n/i18n-context';

export function TaskListHeader() {
    const t = useT();

    return (
        <div
            aria-hidden="true"
            className="text-muted mb-1 hidden px-4 text-xs font-semibold tracking-wide uppercase md:flex md:items-center"
        >
            <div className="flex w-5/12 items-center gap-4">
                <div className="h-4 w-4 shrink-0" />
                <span className="break-words">{t('tasks.tasks')}</span>
            </div>
            <div className="grid w-7/12 grid-cols-4 gap-2 px-2">
                <span className="break-words">{t('tasks.priority.label')}</span>
                <span className="break-words">{t('tasks.estimateTime')}</span>
                <span className="break-words">{t('tasks.createdAt')}</span>
                <span className="break-words">{t('tasks.completedAt')}</span>
            </div>
        </div>
    );
}
