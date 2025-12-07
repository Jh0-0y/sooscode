import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set) => ({
            darkMode: false,
            setDarkMode: (darkMode) => {
                set({ darkMode });
                document.documentElement.setAttribute(
                    'data-theme',
                    darkMode ? 'dark' : 'light'
                );
            },
            toggleDarkMode: () =>
                set((state) => {
                    const newDarkMode = !state.darkMode;
                    document.documentElement.setAttribute(
                        'data-theme',
                        newDarkMode ? 'dark' : 'light'
                    );
                    return { darkMode: newDarkMode };
                }),
        }),
        {
            name: 'theme-storage',
        }
    )
);