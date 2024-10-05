import { Theme } from '@/types';
import { store } from '..';

export const changeTheme = (theme: Theme) => store.dispatch({ type: 'SET_THEME', payload: theme });
