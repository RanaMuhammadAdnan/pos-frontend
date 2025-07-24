import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ThemeMode = 'light' | 'dark';

// Persistent theme atom with localStorage
export const themeAtom = atomWithStorage<ThemeMode>('pos-theme', 'light');

// Derived atom for theme toggle
export const toggleThemeAtom = atom(
  (get) => get(themeAtom),
  (get, set) => {
    const currentTheme = get(themeAtom);
    set(themeAtom, currentTheme === 'light' ? 'dark' : 'light');
  }
); 