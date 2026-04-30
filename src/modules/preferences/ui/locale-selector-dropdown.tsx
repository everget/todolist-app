import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocale } from '@/modules/preferences/store/locale-slice';
import { useT } from '@/shared/i18n/i18n-context';
import { LOCALES } from '@/shared/i18n/locales';
import { type Locale } from '@/types';

export function LocaleSelectorDropdown() {
    const t = useT();
    const dispatch = useAppDispatch();
    const locale = useAppSelector((state) => state.locale);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const current = LOCALES[locale];

    useEffect(() => {
        document.documentElement.setAttribute('lang', locale);
    }, [locale]);

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    function handleSelect(code: Locale) {
        dispatch(setLocale(code));
        setOpen(false);
    }

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                data-testid="locale-selector"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="bg-primary hover:bg-primary-hover focus:ring-primary mr-4 flex items-center rounded-md px-4 py-1 text-white focus:ring-2 focus:outline-none"
            >
                <span className="mr-2">{locale.toUpperCase()}</span>
                <img src={current.flagSrc} alt={t(current.flagKey)} className="h-8 w-8" />
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {open && (
                <div className="bg-background absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg">
                    <ul className="py-1 text-sm" role="listbox">
                        {Object.values(LOCALES).map((l) => (
                            <li key={l.code} role="option" aria-selected={locale === l.code}>
                                <button
                                    type="button"
                                    data-testid={`locale-${l.code}`}
                                    onClick={() => handleSelect(l.code)}
                                    className="text-foreground hover:bg-secondary focus:bg-secondary focus:ring-primary flex w-full items-center px-4 py-2 text-left focus:ring-2 focus:outline-none"
                                >
                                    <img
                                        src={l.flagSrc}
                                        alt={t(l.flagKey)}
                                        className="mr-2 h-6 w-6"
                                    />
                                    <span>{l.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
