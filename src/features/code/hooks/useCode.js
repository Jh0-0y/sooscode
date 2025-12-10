import { create } from 'zustand';

/* 외부 노출을 막고 훅 내부에서만 사용하는 캡슐화된 스토어 */
const codeStore = create((set) => ({
    code: '',
    setCode: (code) => set({ code }),
}));

export const useCode = () => {
    const code = codeStore((state) => state.code);
    const setCode = codeStore((state) => state.setCode);

    return {
        code,
        setCode,
    };
};