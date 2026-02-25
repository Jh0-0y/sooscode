// features/classroom/utils/editorUtils.js

/**
 * Monaco Editor 테마 적용
 */
export const applyEditorTheme = (monaco, darkMode) => {
    if (!monaco) return;

    const bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-bg-primary")
        .trim();

    const baseTheme = darkMode ? "vs-dark" : "vs";

    monaco.editor.defineTheme("customTheme", {
        base: baseTheme,
        inherit: true,
        rules: [],
        colors: {
            "editor.background": bg,
        },
    });

    monaco.editor.setTheme("customTheme");
};

/**
 * Monaco Editor 기본 옵션
 */
export const getEditorOptions = (isReadOnly = false) => ({
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
    scrollBeyondLastLine: false,
    wordWrap: "off",
    lineDecorationsWidth: 1,
    lineNumbersMinChars: 5,
    automaticLayout: true,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    readOnly: isReadOnly,
    padding: {
        top: 16,
        bottom: 16,
    },
    scrollbar: {
        verticalScrollbarSize: 4,
        verticalSliderSize: 4,
    },
});

/**
 * 코드 실행 (컴파일)
 */
export const executeCode = async (code, api) => {
    try {
        const encoded = btoa(unescape(encodeURIComponent(code)));

        const response = await api.post("/api/compile/run", {
            code: encoded,
        });

        const result = response.data;
        return {
            success: true,
            output: result.output || "결과가 없습니다."
        };

    } catch (err) {
        if (err.response) {
            return {
                success: false,
                output: "백엔드 오류:\n" + JSON.stringify(err.response.data, null, 2)
            };
        }
        return {
            success: false,
            output: "네트워크 오류:\n" + err.message
        };
    }
};

/**
 * 코드 복사
 */
export const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("복사 되었습니다.");
};