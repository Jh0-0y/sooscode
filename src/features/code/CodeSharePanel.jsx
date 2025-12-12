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

    /**
     * 웹소켓 구독
     */
    useEffect(() => {
        if (!socket || !classId) {
            console.warn('[CodeSharePanel] Socket or classId not available');
            return;
        }

        if (!socket.connected) {
            console.warn('[CodeSharePanel] Socket not connected yet');
            return;
        }

        console.log('[CodeSharePanel] Subscribing to: /topic/code/' + classId);

        const subscription = socket.subscribe(
            `/topic/code/${classId}`,
            (data) => {
                handleReceivedCode(data);

                console.log('======받는 데이터======', data);
            }
        );


        return () => {
            if (subscription) {
                console.log('[CodeSharePanel] Unsubscribing...');
                subscription.unsubscribe();
            }
        };
    }, [socket, socket?.connected, classId]);

    /**
     * 받은 코드 처리
     */
    const handleReceivedCode = (dto) => {

        console.log("[업데이트] code:", dto.code);
        console.log("[업데이트] output:", dto.output);

        // 코드 업데이트
        if (dto.code !== undefined) {
            setSharedCode(dto.code);

            if (editorInstance) {
                const pos = editorInstance.getPosition();
                editorInstance.setValue(dto.code);
                if (pos) editorInstance.setPosition(pos);
            }
        }

        // output 업데이트
        setOutput(dto.output || "");
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