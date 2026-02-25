import { useRef } from 'react';

export const useResize = (onResize) => {
    const targetRef = useRef(null);

    const startResize = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };

    const handleResize = (e) => {
        if (!targetRef.current) return;

        const containerLeft = targetRef.current.parentElement.getBoundingClientRect().left;
        const newWidth = e.clientX - containerLeft;

        targetRef.current.style.width = `${newWidth}px`;

        // 콜백 실행 (에디터 레이아웃 등)
        if (onResize) onResize();
    };

    const stopResize = () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    };

    return {
        targetRef,
        startResize
    };
};