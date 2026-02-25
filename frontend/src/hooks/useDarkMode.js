import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 헬퍼 함수
const applyTheme = (darkMode) => {
    document.documentElement.setAttribute(
        'data-theme',
        darkMode ? 'dark' : 'light'
    );
};

export const useThemeStore = create(
    persist(
        (set) => ({
            darkMode: false,

            setDarkMode: (darkMode) => {
                set({ darkMode });
                applyTheme(darkMode);
            },

            toggleDarkMode: () =>
                set((state) => {
                    const newDarkMode = !state.darkMode;
                    applyTheme(newDarkMode);
                    return { darkMode: newDarkMode };
                }),
        }),
        {
            name: 'theme-storage',
        }
    )
);

export const useDarkMode = () => {
    const darkMode = useThemeStore((state) => state.darkMode);
    const setDarkMode = useThemeStore((state) => state.setDarkMode);
    const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

    // 초기 테마 적용
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme-storage');

        if (savedTheme) {
            const { state } = JSON.parse(savedTheme);
            applyTheme(state.darkMode);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
    }, [setDarkMode]);

    return {
        darkMode,
        setDarkMode,
        toggleDarkMode,
    };
};

/**
 * 다크모드 커스텀 훅 사용법
 * // 훅 입포트
 * import { useDarkMode } from "@/hooks/useDarkMode";
 * // 훅 구조 분해 할당(안쓰는 건 안가져와도 됨)
 * const { darkMode, toggleDarkMode, setDarkMode } = useDarkMode();
 * // 모드 변경(반전 토글)
 * <button onClick={toggleDarkMode}>모드 변경</button>
 * // 모드 변경(선택 true/false)
 * <button onClick={() => setDarkMode(true)}>다크모드</button>
 * // 모드 확인 다크모드(true)/라이트모드(false)
 * <div>{darkMode ? "🌙" : "☀️"}</div>
 */