import Editor from '@monaco-editor/react';
import {useEffect, useRef, useState} from "react";
import {useDarkMode} from "@/hooks/useDarkMode.js";
import styles from './CodePanel.module.css';
import {api} from "@/services/api";


const CodeSharePanel = ({socket, classId}) => {
    const {darkMode} = useDarkMode();

    // 로컬 상태 사용 (독립적인 코드 관리)
    const [sharedCode, setSharedCode] = useState("// 공유된 코드가 여기에 표시됩니다...");
    const [editorInstance, setEditorInstance] = useState(null);
    const [monacoInstance, setMonacoInstance] = useState(null);
    const [output, setOutput] = useState("");
    const [lastUpdateTime, setLastUpdateTime] = useState(null);

    /**
     * 웹소켓 구독
     */
    useEffect(() => {
        if (!socket || !classId) {
            return;
        }

        if (!socket.connected) {
            return;
        }

        const subscription = socket.subscribe(
            `/topic/code/${classId}`,
            (data) => {
                handleReceivedCode(data);
            }
        );

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [socket, socket?.connected, classId]);

    /**
     * 받은 코드 처리
     */
    const handleReceivedCode = (dto) => {
        // 코드 업데이트
        if (dto.code !== undefined) {
            setSharedCode(dto.code);

            if (editorInstance) {
                // 현재 커서 위치 저장
                const currentPosition = editorInstance.getPosition();
                const currentScrollTop = editorInstance.getScrollTop();

                // 코드 업데이트
                editorInstance.setValue(dto.code);

                // 커서와 스크롤 위치 복원 (읽기 전용이지만 사용자 경험 향상)
                if (currentPosition) {
                    editorInstance.setPosition(currentPosition);
                }
                editorInstance.setScrollTop(currentScrollTop);
            }

            // 마지막 업데이트 시간 기록
            setLastUpdateTime(new Date().toLocaleTimeString());
        }

        // output 업데이트
        if (dto.output !== undefined) {
            setOutput(dto.output || "");
        }
    };

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
     * 복사 기능
     */
    const copy = () => {
        navigator.clipboard.writeText(sharedCode);
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
        readOnly: true, // 읽기 전용
    };

    return (
        <>
            <div className={`${styles.relative} ${styles.editorWrapper} ${styles.editorWrapperRight}`}>
                {/* 실시간 업데이트 인디케이터 */}
                {lastUpdateTime && (
                    <div className={styles.indigator}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-clock-check-icon lucide-clock-check">
                            <path d="M12 6v6l4 2"/>
                            <path d="M22 12a10 10 0 1 0-11 9.95"/>
                            <path d="m22 16-5.5 5.5L14 19"/>
                        </svg>
                        마지막 업데이트: {lastUpdateTime}
                    </div>
                )}

                <Editor
                    language="javascript"
                    value={sharedCode}
                    onChange={(value) => setSharedCode(value)}
                    options={options}
                    onMount={handleEditorMount}
                    theme="customTheme"
                    className={styles.editor}
                />

                {/* 하단 결과창 */}
                <div className={`${styles.bottomPane} ${styles.bottomPaneRight}`} ref={bottomRef}>
                    {/* 리사이즈 바 */}
                    <div className={styles.resizer} onMouseDown={startResize}>
                        <div className={styles.dotWrap}/>
                    </div>

                    {/* 컴파일 창*/}
                    <div className={styles.resultHeader}>
                        <div className={styles.flex}>
                            <button onClick={copy} className={styles.copyButton} title="복사">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <pre className={styles.resultOutput}>{output || "결과가 여기에 표시됩니다."}</pre>
                </div>
            </div>
        </>
    )
}

export default CodeSharePanel;