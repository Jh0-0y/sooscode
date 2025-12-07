// hooks/useDarkMode.js
import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const useDarkMode = () => {
    const darkMode = useThemeStore((state) => state.darkMode);
    const setDarkMode = useThemeStore((state) => state.setDarkMode);
    const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

    // 초기 테마 적용
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme-storage');

        if (savedTheme) {
            const { state } = JSON.parse(savedTheme);
            document.documentElement.setAttribute(
                'data-theme',
                state.darkMode ? 'dark' : 'light'
            );
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
 * 원하는 곳에서 const { darkMode, toggleDarkMode } = useDarkMode();를 호출
 *
 * event로 toggleDarkMode를 실행시키면 됨(버튼을 누를 때마다 반전 됨)
 * ex) <button onClick={toggleDarkMode} />
 *
 * darkMode의 값은 boolean 즉 true/false를 가지고 있는데 삼항 연산자로 라이트 모드인지 다크모드인지
 * 구분할 수 있음
 * ex) {darkMode ? '현재 다크모드' : '현재 라이트 모드'}
 */