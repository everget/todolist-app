import { Locale } from '@/types';
import { store } from '..';

export const changeLocale = (locale: Locale) =>
	store.dispatch({ type: 'SET_LOCALE', payload: locale });
