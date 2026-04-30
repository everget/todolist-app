import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/modules/preferences/store/theme-slice';
import { useT } from '@/shared/i18n/i18n-context';

function ThemeIcon({ icon, label }: { icon: string; label: string }) {
    return (
        <span role="img" aria-label={label} className="text-lg">
            {icon}
        </span>
    );
}

export function ThemeToggleButton() {
    const t = useT();
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    const isDark = theme === 'dark';

    // Sync the <html> class with the Redux theme state on mount and changes.
    // We add both .dark and .light so the CSS @media (prefers-color-scheme: dark)
    // rule can distinguish an explicit user choice from "no preference yet".
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    function handleClick() {
        dispatch(setTheme(isDark ? 'light' : 'dark'));
    }

    return (
        <button
            type="button"
            title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
            aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
            onClick={handleClick}
            className="bg-secondary focus:ring-primary flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors duration-200 focus:ring-2 focus:outline-none"
        >
            {isDark ? (
                <ThemeIcon icon="🌙" label={t('theme.dark')} />
            ) : (
                <ThemeIcon icon="☀️" label={t('theme.light')} />
            )}
        </button>
    );
}
