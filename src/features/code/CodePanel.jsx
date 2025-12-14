import Editor from '@monaco-editor/react';
import {useEffect, useRef, useState} from "react";
import {useDarkMode} from "@/hooks/useDarkMode.js";
import styles from './CodePanel.module.css';
import {useCode} from "@/features/code/hooks/useCode.js";
import {api} from "@/services/api";


const CodePanel = ({socket, classId}) => {
    const {darkMode} = useDarkMode();
    const {code, setCode, editorInstance, setEditorInstance} = useCode();
    const [monacoInstance, setMonacoInstance] = useState(null);
    const [output, setOutput] = useState("");
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 디바운싱을 위한 타이머 ref
    const debounceTimerRef = useRef(null);
    const isInitialLoadRef = useRef(true);

    /**
     * 페이지 진입 시 자동 저장된 코드 불러오기
     */
    useEffect(() => {

        const loadAutoSaved = async () => {

            if (!classId) {
                return;
            }

            try {
                setIsLoading(true);
                console.log("🔄 자동 저장 코드 불러오는 중...", classId);

                console.log("❌❌❌❌❌");


                const response = await api.get(`/api/code/auto-save?classId=${classId}`);

                console.log("📦 API 응답:", response.status, response.data);

                if (response.status === 200 && response.data) {
                    const autoSaved = response.data;

                    console.log("✅ 자동 저장된 코드 발견:", {
                        codeLength: autoSaved.code?.length,
                        savedAt: autoSaved.savedAt
                    });

                    // Zustand 스토어 업데이트 (가장 중요!)
                    setCode(autoSaved.code || "// write code");
                    setOutput(autoSaved.output || "");

                    // 에디터가 이미 마운트되어 있으면 즉시 업데이트
                    if (editorInstance) {
                        console.log("📝 에디터에 코드 설정");
                        editorInstance.setValue(autoSaved.code || "// write code");
                    }

                    setLastSavedTime(new Date(autoSaved.savedAt));
                } else {
                    console.log("ℹ️ 자동 저장 없음 - 기본값 사용");
                    setCode("// write code");
                }
            } catch (error) {
                // 204 No Content 또는 404는 정상 (자동 저장 없음)
                if (error.response?.status === 204 || error.response?.status === 404) {
                    console.log("ℹ️ 자동 저장된 코드 없음 (204/404)");
                    setCode("// write code");
                } else {
                    console.error("❌ 자동 저장 불러오기 실패:", error);
                    setCode("// write code");
                }
            } finally {
                setIsLoading(false);
                isInitialLoadRef.current = false;
            }
        };

        loadAutoSaved();
    }, [classId, setCode]);

    /**
     * 코드 자동 전송 (디바운싱 적용)
     */
    useEffect(() => {
        // 초기 로딩 중이거나 첫 로드일 때는 전송 안 함
        if (isInitialLoadRef.current || isLoading) return;

        if (!socket || !socket.connected || !classId) return;

        // 이전 타이머 취소
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 300ms 후에 전송 (타이핑이 멈추면 전송)
        debounceTimerRef.current = setTimeout(() => {
            const message = {
                code: code,
                language: 'javascript',
                output: output || null,
            };

            try {
                socket.publish(`/app/code/${classId}`, message);
                setLastSavedTime(new Date());
            } catch (error) {
                console.error('자동 전송 실패:', error);
            }
        }, 300);

        // 클린업
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [code, output, socket, classId, isLoading]);

    /**
     * 라이트/다크 자동 적용
     */
    const applyTheme = (monaco) => {
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
     * Editor 로딩 시 실행
     */
    const handleEditorMount = (editor, monaco) => {
        setEditorInstance(editor);
        setMonacoInstance(monaco);
        applyTheme(monaco);

        const wrapper = editor.getDomNode().parentElement;
        const observer = new ResizeObserver(() => editor.layout());
        observer.observe(wrapper);

        editor.__observer = observer;

        // 에디터 마운트 후 현재 code 값으로 설정
        if (code && code !== "// write code") {
            editor.setValue(code);
        }
    };

    /**
     * 테마 모드 바뀔 때마다 테마 재적용
     */
    useEffect(() => {
        if (monacoInstance) {
            applyTheme(monacoInstance);
        }
    }, [darkMode]);

    /**
     * 컴파일 창 리사이즈
     */
    const bottomRef = useRef(null);
    const startResize = (e) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
    };

    const handleResize = (e) => {
        const containerTop = bottomRef.current.parentElement.getBoundingClientRect().top;
        const containerHeight = bottomRef.current.parentElement.offsetHeight;

        const newHeight = containerHeight - (e.clientY - containerTop);

        bottomRef.current.style.height = `${newHeight}px`;

        if (editorInstance) editorInstance.layout();
    };

    const stopResize = () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
    };

    /**
     * 컴파일 실행
     */
    const run = async () => {
        try {
            const encoded = btoa(unescape(encodeURIComponent(code)));

            const response = await api.post("/api/compile/run", {
                code: encoded,
            });

            const result = response.data;
            setOutput(result.output || "결과가 없습니다.");

        } catch (err) {
            if (err.response)
                setOutput("백엔드 오류:\n" + JSON.stringify(err.response.data, null, 2));
            else
                setOutput("네트워크 오류:\n" + err.message);
        }
    }

    const reset = () => {
        setCode("// write code");
        if (editorInstance) editorInstance.setValue("// write code");
    };

    const copy = () => {
        navigator.clipboard.writeText(code);
        alert("Copied!");
    };

    /**
     * 모나코 에디터 내장 옵션
     */
    const options = {
        minimap: {enabled: false},
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineDecorationsWidth: 1,
        lineNumbersMinChars: 1,
        automaticLayout: true,
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        scrollbar: {
            verticalScrollbarSize: 4,
            verticalSliderSize: 4,
        },
    };

    return (
        <div className={`${styles.relative} ${styles.editorWrapper}`}>
            {/* 자동 저장 상태 표시 */}
            {lastSavedTime && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    zIndex: 10,
                    pointerEvents: 'none'
                }}>
                    💾 {lastSavedTime.toLocaleTimeString()}
                </div>
            )}

            <Editor
                language="javascript"
                value={code}
                onChange={(value) => setCode(value)}
                options={options}
                onMount={handleEditorMount}
                theme="customTheme"
                className={styles.editor}
            />

            {/* 하단 결과창 */}
            <div className={styles.bottomPane} ref={bottomRef}>
                {/* 리사이즈 바 */}
                <div className={styles.resizer} onMouseDown={startResize}>
                    <div className={styles.dotWrap}/>
                </div>

                {/* 컴파일 창*/}
                <div className={styles.resultHeader}>
                    <div className={styles.flex}>
                        <button onClick={run} className={styles.runButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                            </svg>
                        </button>
                        <button onClick={reset} className={styles.resetButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                            </svg>
                        </button>
                        <button onClick={copy} className={styles.copyButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <pre className={styles.resultOutput}>{output || "결과가 여기에 표시됩니다."}</pre>
            </div>
        </div>
    )
}

export default CodePanel;