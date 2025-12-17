// features/classroom/components/CodeSharePanel.jsx (학생 선택 버전)

import Editor from '@monaco-editor/react';
import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styles from './CodePanel.module.css';
import { useMonacoEditor } from "@/features/classroom/hooks/code/useMonacoEditor.js";
import { useCodeExecution } from "@/features/classroom/hooks/code/useCodeExecution.js";
import { getEditorOptions } from "@/features/classroom/utils/editorUtils.js";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext";
import { CLASS_MODES, useClassMode } from "@/features/classroom/contexts/ClassModeContext.jsx";
import { useUser } from "@/hooks/useUser.js";
import { useSelectedStudent } from "@/features/classroom/hooks/class/useSelectedStudent.js";

const CodeSharePanel = ({ classId, isInstructor = false }) => {
    const { user } = useUser();
    const { selectedStudent } = useSelectedStudent(); // 선택된 학생
    const [sharedCode, setSharedCode] = useState('');
    const [senderInfo, setSenderInfo] = useState(null);
    const { editorInstance, handleEditorMount } = useMonacoEditor();
    const { output, run, copy } = useCodeExecution(sharedCode);
    const { mode } = useClassMode();
    const socket = useSocketContext();
    const debounceTimerRef = useRef(null);

    // 항상 읽기 전용
    const isReadOnly = true;

    // 역할에 따른 구독 토픽 결정
    const subscribeTopic = isInstructor
        ? `/topic/code/student/${classId}`
        : `/topic/code/instructor/${classId}`;

    // 초기 메시지 설정
    const getInitialMessage = () => {
        if (isInstructor) {
            return selectedStudent
                ? `// ${selectedStudent.username}의 코드를 기다리는 중...`
                : '// 왼쪽 사이드바에서 학생을 선택하세요';
        }
        return '// 강사 코드를 기다리는 중...';
    };

    // 선택된 학생 변경 시 초기화
    useEffect(() => {
        if (isInstructor) {
            if (selectedStudent) {
                setSharedCode(`// ${selectedStudent.username}의 코드를 기다리는 중...`);
                setSenderInfo(null);
            } else {
                setSharedCode('// 왼쪽 사이드바에서 학생을 선택하세요');
                setSenderInfo(null);
            }
        }
    }, [selectedStudent, isInstructor]);

    // 코드 수신 구독
    useEffect(() => {
        if (!socket || !socket.connected) {
            console.log('[CodeSharePanel] 소켓 미연결 또는 classId 없음');
            return;
        }

        console.log(`[CodeSharePanel] 구독 시작: ${subscribeTopic}`);

        const subscription = socket.subscribe(subscribeTopic, (data) => {
            console.log('[CodeSharePanel] 수신 데이터:', {
                ...data,
                isInstructor,
                selectedStudent: selectedStudent?.username
            });

            if (!data || data.code == null) return;

            // 강사: 선택된 학생의 코드만 표시
            if (isInstructor) {
                // 선택된 학생이 없으면 모든 코드 무시
                if (!selectedStudent) {
                    console.log('[CodeSharePanel-Instructor] 학생 선택 안 됨 - 무시');
                    return;
                }

                // 선택된 학생의 코드가 아니면 무시
                if (data.userEmail !== selectedStudent.userEmail &&
                    data.userId !== selectedStudent.userId) {
                    console.log('[CodeSharePanel-Instructor] 선택되지 않은 학생 코드 무시:', data.userId);
                    return;
                }

                console.log('[CodeSharePanel-Instructor] 선택된 학생 코드 수신:', selectedStudent.username);
            }

            // 학생 CodeSharePanel 필터링
            if (!isInstructor) {
                console.log('[CodeSharePanel-Student] 필터링 시작:', {
                    type: data.type,
                    userEmail: data.userEmail,
                    myEmail: user?.email,
                    code: data.code?.substring(0, 30)
                });

                // 1. 자기가 보낸 메시지 무시
                if (data.userEmail === user?.email) {
                    console.log('[CodeSharePanel-Student] 자기가 보낸 메시지 무시');
                    return;
                }

                // 2. STUDENT_EDIT 타입 무시
                if (data.type === 'STUDENT_EDIT') {
                    console.log('[CodeSharePanel-Student] STUDENT_EDIT 무시');
                    return;
                }

                // 3. undefined 타입 무시 (다른 학생)
                if (data.type === undefined) {
                    console.log('[CodeSharePanel-Student] undefined type 무시 (학생 메시지)');
                    return;
                }

                // 4. INSTRUCTOR_EXAMPLE 타입만 통과
                if (data.type === 'INSTRUCTOR_EXAMPLE') {
                    console.log('[CodeSharePanel-Student] 강사 예제 수신 성공!');
                } else {
                    console.log('[CodeSharePanel-Student] 알 수 없는 타입 무시:', data.type);
                    return;
                }
            }

            setSharedCode(data.code);
            setSenderInfo({
                userId: data.userId,
                userEmail: data.userEmail,
                timestamp: new Date(),
            });
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log(`[CodeSharePanel] 구독 해제: ${subscribeTopic}`);
            }
        };
    }, [socket, socket?.connected, classId, subscribeTopic, isInstructor, user?.email, selectedStudent]);

    // 강사가 학생 코드를 편집했을 때 해당 학생에게 전송
    useEffect(() => {
        if (!isInstructor) return;
        if (!socket || !socket.connected || !classId) return;
        if (!senderInfo || !selectedStudent) return; // 선택된 학생이 있을 때만

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const message = {
                code: sharedCode,
                language: 'javascript',
                output: output || null,
                type: 'STUDENT_EDIT',
                targetEmail: selectedStudent.userEmail, // 선택된 학생 이메일
            };

            try {
                const endpoint = `/app/code/instructor/${classId}`;
                socket.publish(endpoint, message);

                console.log(`[CodeSharePanel] 강사가 편집한 ${selectedStudent.username} 코드 전송`);
            } catch (error) {
                console.error('코드 전송 실패:', error);
            }
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [sharedCode, output, socket, classId, isInstructor, senderInfo, selectedStudent]);

    const options = getEditorOptions(isReadOnly);

    return (
        <div className={`${styles.relative} ${styles.editorWrapper}`}>
            {/* 헤더 */}
            <div className={styles.shareHeader}>
                {/*<h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>*/}
                {/*    {isInstructor ? (*/}
                {/*        selectedStudent*/}
                {/*            ? `📝 ${selectedStudent.username}의 코드`*/}
                {/*            : '📝 학생 코드'*/}
                {/*    ) : '👨‍🏫 강사 코드 (실시간)'}*/}
                {/*</h3>*/}
                {senderInfo && (
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {senderInfo.timestamp.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {/* 선택 안내 메시지 */}
            {isInstructor && !selectedStudent && (
                <div className={styles.selectionGuide}>
                    ← 왼쪽 사이드바에서 학생을 선택하세요
                </div>
            )}

            {/* 읽기 전용/편집 가능 배지 */}
            {isInstructor && selectedStudent ? (
                <div className={styles.editableBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                    편집 가능
                </div>
            ) : (
                <div className={styles.readOnlyBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {isInstructor && !selectedStudent ? '학생 선택 필요' : '실시간 동기화'}
                </div>
            )}

            <PanelGroup direction="vertical">
                {/* 에디터 패널 */}
                <Panel defaultSize={70} minSize={30}>
                    <Editor
                        language="javascript"
                        value={sharedCode}
                        onChange={(value) => isInstructor && selectedStudent && setSharedCode(value)}
                        options={{
                            ...options,
                            readOnly: true
                        }}
                        onMount={handleEditorMount}
                        theme="customTheme"
                        className={styles.editor}
                    />
                </Panel>

                {/* 리사이즈 핸들 */}
                <PanelResizeHandle className={styles.verticalResizer}>
                    <div className={styles.dotWrap} />
                </PanelResizeHandle>

                {/* 결과 패널 */}
                <Panel defaultSize={30} minSize={15} maxSize={70}>
                    <div className={styles.bottomPane}>
                        <div className={styles.resultHeader}>
                            <div className={styles.flex}>
                                <button onClick={run} className={styles.runButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                    </svg>
                                </button>
                                <button onClick={copy} className={styles.copyButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <pre className={styles.resultOutput}>{output || "결과가 여기에 표시됩니다."}</pre>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default CodeSharePanel;