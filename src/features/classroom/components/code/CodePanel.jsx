import Editor from '@monaco-editor/react';
import {useEffect, useRef, useState} from "react";
import {useDarkMode} from "@/hooks/useDarkMode.js";
import styles from './CodePanel.module.css';
import {useCode} from "@/features/classroom/hooks/code/useCode.js";
import {api} from "@/services/api.js";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext";
import { useClassMode, CLASS_MODES } from "@/features/classroom/contexts/ClassModeContext";

const CodePanel = ({classId, isInstructor = false}) => {
    const {darkMode} = useDarkMode();
    const {code, setCode, editorInstance, setEditorInstance} = useCode();
    const [monacoInstance, setMonacoInstance] = useState(null);
    const [output, setOutput] = useState("");
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const socket = useSocketContext();
    const { mode } = useClassMode();

    const debounceTimerRef = useRef(null);
    const isInitialLoadRef = useRef(true);

    // 선생님은 항상 편집 가능, 학생만 읽기 전용 모드의 영향을 받음
    const isReadOnly = !isInstructor && mode === CLASS_MODES.VIEW_ONLY;

    useEffect(() => {
        if (!editorInstance) return;

        editorInstance.updateOptions({
            readOnly: isReadOnly, domReadOnly: isReadOnly,

        });
    }, [isReadOnly]);


    useEffect(() => {
        const loadAutoSavedCode = async () => {
            try {
                const autoSaved = await api.get("/api/code/auto-save", {
                    params: { classId }
                });

                if (autoSaved?.code) {
                    setCode(autoSaved.code);
                }
            } catch (e) {
                console.log("자동 저장 없음");
            } finally {
                setIsLoading(false);
                isInitialLoadRef.current = false;
            }
        };

        if (classId) {
            loadAutoSavedCode();
        }
    }, [classId]);

    useEffect(() => {
        if (isInitialLoadRef.current || isLoading) return;
        if (!socket || !socket.connected || !classId) return;

        // 선생님은 항상 자동 전송, 학생은 읽기 전용 모드가 아닐 때만 자동 전송
        if (isReadOnly) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const message = {
                code: code,
                language: 'javascript',
                output: output || null,
            };

            try {
                // ✅ 수정: 역할에 따라 다른 엔드포인트 사용
                const endpoint = isInstructor
                    ? `/app/code/instructor/${classId}`  // 강사용
                    : `/app/code/student/${classId}`;    // 학생용

                socket.publish(endpoint, message);
                setLastSavedTime(new Date());

                console.log(`[CodePanel] 코드 전송: ${endpoint}`);
            } catch (error) {
                console.error('자동 전송 실패:', error);
            }
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [code, output, socket, classId, isLoading, isReadOnly, isInstructor]); // ✅ isInstructor 의존성 추가




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

    const handleEditorMount = (editor, monaco) => {
        setEditorInstance(editor);
        setMonacoInstance(monaco);
        applyTheme(monaco);

        const wrapper = editor.getDomNode().parentElement;
        const observer = new ResizeObserver(() => editor.layout());
        observer.observe(wrapper);

        editor.__observer = observer;

        // if (code && code !== "// write code") {
        //     editor.setValue(code);
        // }
    };

    // 모드가 변경될 때 에디터 옵션 업데이트
    useEffect(() => {
        if (editorInstance) {
            editorInstance.updateOptions({ readOnly: isReadOnly });
        }
    }, [isReadOnly, editorInstance]);

    useEffect(() => {
        if (monacoInstance) {
            applyTheme(monacoInstance);
        }
    }, [darkMode]);

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
        if (isReadOnly) return; // 읽기 전용에서는 리셋 불가
        //if (editorInstance) editorInstance.setValue("// write code");
    };

    const copy = () => {
        navigator.clipboard.writeText(code);
        alert("복사 되었습니다.");
    };

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
        readOnly: isReadOnly, // 선생님은 항상 false, 학생만 모드에 따라 변경
        scrollbar: {
            verticalScrollbarSize: 4,
            verticalSliderSize: 4,
        },
    };
    useEffect(() => {
        if (editorInstance) {
            editorInstance.updateOptions({ readOnly: isReadOnly });
        }
    }, [isReadOnly]);

    return (
        <div className={`${styles.relative} ${styles.editorWrapper}`}>

            {/* 학생에게만 읽기 전용 모드 표시 */}
            {!isInstructor && isReadOnly && (
                <div className={styles.readOnlyBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    읽기 전용
                </div>
            )}

            {lastSavedTime && !isReadOnly && (
                <div className={styles.indigator}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-save-icon lucide-save">
                        <path
                            d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
                        <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
                    </svg>
                    {lastSavedTime.toLocaleTimeString()}
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

            <div className={styles.bottomPane} ref={bottomRef}>
                <div className={styles.resizer} onMouseDown={startResize}>
                    <div className={styles.dotWrap}/>
                </div>

                <div className={styles.resultHeader}>
                    <div className={styles.flex}>
                        {/* 실행은 항상 가능 */}
                        <button onClick={run} className={styles.runButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                            </svg>
                        </button>
                        {/* 리셋은 읽기 전용이 아닐 때만 */}
                        <button
                            onClick={reset}
                            className={styles.resetButton}
                            disabled={isReadOnly}
                        >
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