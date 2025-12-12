import Editor from '@monaco-editor/react';
import {useEffect, useRef, useState} from "react";
import {useDarkMode} from "@/hooks/useDarkMode.js";
import styles from './CodePanel.module.css';
import {useCode} from "@/features/code/hooks/useCode.js";
import {api} from "@/services/api";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";


const CodePanel = ({classId}) => {
    const {darkMode} = useDarkMode();

    const {code, setCode, editorInstance, setEditorInstance} = useCode();
    const [monacoInstance, setMonacoInstance] = useState(null);
    const [output, setOutput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const finalClassId = classId || 1;

    /**
     * 웹소켓 연결
     */
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        const headers = {
            // Authorization: `Bearer ${token}`
        };

        client.connect(
            headers,
            () => {
                setIsConnected(true);
                setStompClient(client);
            },
            (error) => {
                setIsConnected(false);
                console.log(error);
            }
        );

        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [finalClassId]);


    /**
     * 코드 전송
     */
    const sendCode = () => {
        if (!stompClient || !stompClient.connected) {
            alert('웹소켓 연결이 끊어졌습니다.');
            return;
        }

        const message = {
            code: code,
            language: 'javascript',
            output: output || null,
        };

        stompClient.send(
            `/topic/code/${finalClassId}`,
            {},
            JSON.stringify(message)
        );

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
        applyTheme(monaco); // 초기 적용

        // ResizeObserver로 부모 크기 변하면 자동 적용
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

        // 모나코 에디터 레이아웃 갱신
        if (editorInstance) editorInstance.layout();
    };

    const stopResize = () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
    };

    /**
     * 인코딩
     */
    function encodeBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    /**
     * 컴파일 실행
     */
    const run = async () => {
        try {
            const encoded = encodeBase64(code);

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
     * 컴파일 단축키
     */
    // useEffect(() => {
    //     const hadleKeydown = (e) => {
    //         if(e.ctrlKey && e.key === "3"){
    //             e.preventDefault();
    //             run();
    //         }
    //     }
    //     // window 전체에 addEventListener 선언
    //     window.addEventListener("keydown", hadleKeydown);
    //     // 컴포넌트가 사라질때 이벤트 리스너 제거 ( 반복 렌더링 예방 )
    //     return () => window.removeEventListener("keydown", hadleKeydown);
    // }, [run]);

    /**
     * 모나코 에디터 내장 옵션
     */
    const options = {
        minimap: {enabled: false},
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineDecorationsWidth: 1,      // 장식 영역 폭 최소화
        lineNumbersMinChars: 1,       // 줄번호 영역 최소화 (기본 5)
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
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-play-icon lucide-play">
                                <path
                                    d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                            </svg>
                        </button>
                        <button onClick={reset} className={styles.resetButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                            </svg>
                        </button>
                        <button onClick={copy} className={styles.copyButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-copy-icon lucide-copy">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                            </svg>
                        </button>


                        {/* 코드 전송 버튼 추가! */}
                        <button onClick={sendCode} className={styles.sendButton} title="코드 공유">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m22 2-7 20-4-9-9-4Z"/>
                                <path d="M22 2 11 13"/>
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