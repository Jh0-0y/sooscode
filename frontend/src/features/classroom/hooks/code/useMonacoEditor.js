// features/classroom/hooks/code/useMonacoEditor.js

import { useEffect, useState } from 'react';
import { useDarkMode } from "@/hooks/useDarkMode.js";
import { applyEditorTheme } from "@/features/classroom/utils/editorUtils.js";

/**
 * Monaco Editor 초기화 및 테마 관리 훅
 */
export const useMonacoEditor = () => {
    const { darkMode } = useDarkMode();
    const [editorInstance, setEditorInstance] = useState(null);
    const [monacoInstance, setMonacoInstance] = useState(null);

    // 에디터 마운트 핸들러
    const handleEditorMount = (editor, monaco) => {
        setEditorInstance(editor);
        setMonacoInstance(monaco);
        applyEditorTheme(monaco, darkMode);

        // ResizeObserver로 자동 레이아웃
        const wrapper = editor.getDomNode().parentElement;
        const observer = new ResizeObserver(() => editor.layout());
        observer.observe(wrapper);

        // cleanup을 위해 observer 저장
        editor.__observer = observer;
    };

    // 다크모드 변경 시 테마 업데이트
    useEffect(() => {
        if (monacoInstance) {
            applyEditorTheme(monacoInstance, darkMode);
        }
    }, [darkMode, monacoInstance]);

    // cleanup
    useEffect(() => {
        return () => {
            if (editorInstance?.__observer) {
                editorInstance.__observer.disconnect();
            }
        };
    }, [editorInstance]);

    return {
        editorInstance,
        monacoInstance,
        handleEditorMount,
        setEditorInstance,
    };
};