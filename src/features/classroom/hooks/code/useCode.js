import { create } from 'zustand';

/* 외부 노출을 막고 훅 내부에서만 사용하는 캡슐화된 스토어 */
/**
 * 정의
 */
const codeStore = create((set) => ({
    code: '// write code',
    setCode: (code) => set({ code }),
    editorInstance: null,
    setEditorInstance: (instance) => set({ editorInstance: instance }),

}));

/**
 * 사용
 */
export const useCode = () => {
    const code = codeStore((state) => state.code);
    const setCode = codeStore((state) => state.setCode);

    const editorInstance = codeStore((state) => state.editorInstance);
    const setEditorInstance = codeStore((state) => state.setEditorInstance);

    return {
        code,
        setCode,
        editorInstance,
        setEditorInstance
    };
};