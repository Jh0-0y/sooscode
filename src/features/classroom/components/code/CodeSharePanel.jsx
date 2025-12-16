// features/classroom/components/CodeSharePanel.jsx

import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "@/hooks/useDarkMode.js";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext";
import styles from './CodePanel.module.css';
import {api} from "@/services/api.js";
import {CLASS_MODES, useClassMode} from "@/features/classroom/contexts/ClassModeContext.jsx";

const CodeSharePanel = ({ classId, isInstructor = false }) => {
    const { darkMode } = useDarkMode();
    const [sharedCode, setSharedCode] = useState('// 코드를 기다리는 중...');
    const [editorInstance, setEditorInstance] = useState(null);
    const [monacoInstance, setMonacoInstance] = useState(null);
    const [senderInfo, setSenderInfo] = useState(null);
    const [output, setOutput] = useState("");
    const { mode } = useClassMode();

    const socket = useSocketContext();
    const isReadOnly = !isInstructor && mode === CLASS_MODES.VIEW_ONLY;

    // 역할에 따른 구독 토픽 결정
    const subscribeTopic = isInstructor
        ? `/topic/code/student/${classId}`  // 강사는 학생 코드 구독
        : `/topic/code/instructor/${classId}`; // 학생은 강사 코드 구독


    // 코드 수신 구독
    useEffect(() => {
        if (!socket || !socket.connected) {
            console.log('[CodeSharePanel] 소켓 미연결 또는 classId 없음');
            return;
        }

        console.log(`[CodeSharePanel] 구독 시작: ${subscribeTopic}`);

        // useSocket의 subscribe는 이미 JSON.parse를 해줌
        const subscription = socket.subscribe(subscribeTopic, (data) => {
            console.log('[CodeSharePanel] 수신 데이터:', data);

            if (!data || data.code == null) return;

            setSharedCode(data.code);
            setSenderInfo({
                userId: data.userId,
                timestamp: new Date(),
            });
        });


        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log(`[CodeSharePanel] 구독 해제: ${subscribeTopic}`);
            }
        };
    }, [socket, socket?.connected, classId,subscribeTopic]);

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
    };

    useEffect(() => {
        if (monacoInstance) {
            applyTheme(monacoInstance);
        }
    }, [darkMode, monacoInstance]);

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
            const encoded = btoa(unescape(encodeURIComponent(sharedCode)));

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

    const copy = () => {
        navigator.clipboard.writeText(sharedCode);
        alert("복사 되었습니다.");
    };

    const options = {
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineDecorationsWidth: 1,
        lineNumbersMinChars: 1,
        automaticLayout: true,
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        readOnly: true, // 코드 쉐어 패널은 항상 읽기 전용
        scrollbar: {
            verticalScrollbarSize: 4,
            verticalSliderSize: 4,
        },
    };

    return (
        <div className={`${styles.relative} ${styles.editorWrapper}`}>
            {/* 헤더: 누구의 코드인지 표시 */}
            <div className={styles.shareHeader}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                    {isInstructor ? '📝 학생 코드 (실시간)' : '👨‍🏫 강사 코드 (실시간)'}
                </h3>
                {senderInfo && (
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        User #{senderInfo.userId} · {senderInfo.timestamp.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {/* 읽기 전용 뱃지 */}
            <div className={styles.readOnlyBadge}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                실시간 동기화
            </div>

            <Editor
                language="javascript"
                value={sharedCode}
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
    );
};

export default CodeSharePanel;