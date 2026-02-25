// features/classroom/components/code/StudentCodeModal.jsx

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useDarkMode } from '@/hooks/useDarkMode.js';
import { useSocketContext } from '@/features/classroom/contexts/SocketContext';
import { api } from '@/services/api.js';
import styles from './StudentCodeModal.module.css';

const StudentCodeModal = ({ classId, student, onClose }) => {
    const { darkMode } = useDarkMode();
    const [code, setCode] = useState('// 코드를 불러오는 중...');
    const [loading, setLoading] = useState(true);
    const socket = useSocketContext();

    // 초기 코드 로드
    useEffect(() => {
        const loadStudentCode = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    `/api/code/student/${classId}/${student.userId}`
                );

                if (response && response.code) {
                    setCode(response.code);
                } else {
                    setCode('// 저장된 코드가 없습니다.');
                }
            } catch (error) {
                console.error('[StudentCodeModal] 코드 로드 실패:', error);
                setCode('// 코드를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadStudentCode();
    }, [classId, student.userId]);

    // 실시간 코드 업데이트 구독
    useEffect(() => {
        if (!socket || !socket.connected) return;

        const topic = `/topic/code/student/${classId}`;
        console.log('[StudentCodeModal] 구독:', topic);

        const subscription = socket.subscribe(topic, (data) => {
            // 해당 학생의 코드만 업데이트
            if (data.userId === student.userId && data.code) {
                setCode(data.code);
            }
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [socket, socket?.connected, classId, student.userId]);

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        alert('코드가 복사되었습니다.');
    };

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
        applyTheme(monaco);
    };

    const options = {
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        readOnly: true,
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
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* 헤더 */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <h3>{student.username}의 코드</h3>
                        <span className={styles.realTimeBadge}>
                            🔴 실시간
                        </span>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* 에디터 */}
                <div className={styles.modalBody}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>코드를 불러오는 중...</p>
                        </div>
                    ) : (
                        <Editor
                            language="javascript"
                            value={code}
                            options={options}
                            onMount={handleEditorMount}
                            theme="customTheme"
                        />
                    )}
                </div>

                {/* 푸터 */}
                <div className={styles.modalFooter}>
                    <button
                        className={styles.copyButton}
                        onClick={copyCode}
                        disabled={loading}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                        코드 복사
                    </button>
                    <button
                        className={styles.closeFooterButton}
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentCodeModal;