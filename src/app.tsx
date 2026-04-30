import { useAppSelector } from '@/store/hooks';
import { selectHydrationStatus } from '@/store/app-slice';
import { LocaleSelectorDropdown } from '@/modules/preferences/ui/locale-selector-dropdown';
import { ThemeToggleButton } from '@/modules/preferences/ui/theme-toggle-button';
import { NotificationsContainer } from '@/modules/notifications/notifications-container';
import { ListsPanel } from '@/modules/todolist/lists/ui/lists-panel';
import { TasksPanel } from '@/modules/todolist/tasks/ui/tasks-panel';
import { useT } from '@/shared/i18n/i18n-context';

export function App() {
    const t = useT();
    const hydrationStatus = useAppSelector(selectHydrationStatus);

    if (hydrationStatus === 'loading') {
        return (
            <div className="bg-surface flex min-h-screen items-center justify-center">
                <p className="text-muted text-lg">{t('loading')}</p>
            </div>
        );
    }

    if (hydrationStatus === 'error') {
        return (
            <div className="bg-surface flex min-h-screen items-center justify-center">
                <p className="text-danger text-lg">{t('dbError')}</p>
            </div>
        );
    }

    return (
        <div className="bg-surface text-foreground min-h-screen">
            <header className="bg-primary flex items-center justify-between px-6 py-4 text-white shadow-md">
                <h1 className="text-2xl font-bold tracking-wide">{t('appTitle')}</h1>

                <div className="flex items-center gap-1">
                    <LocaleSelectorDropdown />
                    <ThemeToggleButton />
                </div>
            </header>

            <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6 md:flex-row">
                <ListsPanel />
                <TasksPanel />
            </main>
            <NotificationsContainer />
        </div>
    );
}
