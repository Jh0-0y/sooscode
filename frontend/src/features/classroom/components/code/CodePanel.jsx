import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styles from './CodePanel.module.css';
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import { CLASS_MODES } from "@/features/classroom/constants/classModes.js";
import { useMonacoEditor } from "@/features/classroom/hooks/code/useMonacoEditor.js";
import { useCodeExecution } from "@/features/classroom/hooks/code/useCodeExecution.js";
import { getEditorOptions } from "@/features/classroom/utils/editorUtils.js";
import {
    useStudentCodeSender,
    useInstructorCodeSender
} from "@/features/classroom/hooks/code/useCode.js";

const DEFAULT_CODE =
    `class Helloworld {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // 화면에 "Hello, World!"를 출력합니다.
    }
}`;

/**
 * 코드 패널 (내 코드 작성)
 *
 * - 강사: useInstructorCodeSender로 코드 전송
 * - 학생: useStudentCodeSender로 코드 전송 + 강사 수정 수신
 * - 새로고침 시 Redis에서 코드 복원
 */
const CodePanel = ({ code: externalCode, onCodeChange }) => {
    const { classId, userId, isInstructor } = useClassroomContext();
    const { isConnected, classMode } = useSocketContext();

    // 에디터 관련 훅 (기존 유지)
    const { editorInstance, handleEditorMount } = useMonacoEditor();

    // 코드 상태
    const [code, setCode] = useState(DEFAULT_CODE);
    const [language, setLanguage] = useState('java');
    const [isInitialized, setIsInitialized] = useState(false);

    // 코드 실행 훅 (기존 유지)
    const { output, run, copy, hasResult } = useCodeExecution(code);

    // 강사용 코드 전송 훅
    const {
        sendCode: sendInstructorCode,
        isLoading: isInstructorLoading
    } = useInstructorCodeSender({
        classId,
        isConnected,
        debounceDelay: 300,
        onInitialCodeLoaded: useCallback((loadedCode, loadedLanguage) => {
            console.log('[CodePanel - 강사] 초기 코드 로드:', { loadedCode, loadedLanguage });
            setCode(loadedCode);
            onCodeChange?.(loadedCode);
            setLanguage(loadedLanguage);
            setIsInitialized(true);
        }, [onCodeChange]),
    });

    // 학생용 코드 전송 훅
    const {
        sendCode: sendStudentCode,
        isLoading: isStudentLoading
    } = useStudentCodeSender({
        classId,
        userId,
        isConnected,
        debounceDelay: 300,
        onCodeEdited: useCallback((editedCode, editedLanguage) => {
            console.log('[CodePanel - 학생] 강사가 코드 수정:', { editedCode, editedLanguage });
            setCode(editedCode);
            onCodeChange?.(editedCode);
            setLanguage(editedLanguage);
        }, [onCodeChange]),
        onInitialCodeLoaded: useCallback((loadedCode, loadedLanguage) => {
            console.log('[CodePanel - 학생] 초기 코드 로드:', { loadedCode, loadedLanguage });
            setCode(loadedCode);
            onCodeChange?.(loadedCode);
            setLanguage(loadedLanguage);
            setIsInitialized(true);
        }, [onCodeChange]),
    });

    const isLoading = isInstructor ? isInstructorLoading : isStudentLoading;

    // 읽기 전용 여부 (학생만 VIEW_ONLY 모드 영향)
    const isReadOnly = !isInstructor && classMode === CLASS_MODES.VIEW_ONLY;

    // 읽기 전용 모드 에디터 옵션 업데이트
    useEffect(() => {
        if (!editorInstance) return;
        editorInstance.updateOptions({
            readOnly: isReadOnly,
            domReadOnly: isReadOnly,
        });
    }, [isReadOnly, editorInstance]);

    useEffect(() => {
        if (externalCode !== undefined && externalCode !== code) {
            setCode(externalCode);
        }
    }, [externalCode, code]);

    // 코드 변경 핸들러
    const handleCodeChange = (newCode) => {
        if (isReadOnly) return;

        setCode(newCode);
        onCodeChange?.(newCode);

        // 역할에 따라 다른 전송 함수 사용
        if (isInstructor) {
            sendInstructorCode(newCode, language);
        } else {
            sendStudentCode(newCode, language);
        }
    };

    // 코드 초기화
    const handleReset = () => {
        if (isReadOnly) return;

        const confirmed = window.confirm('코드를 초기화하시겠습니까?\n작성한 코드가 모두 삭제됩니다.');
        if (!confirmed) return;

        setCode(DEFAULT_CODE);

        // 초기화된 코드도 서버에 전송
        if (isInstructor) {
            sendInstructorCode(DEFAULT_CODE, language);
        } else {
            sendStudentCode(DEFAULT_CODE, language);
        }
    };

    const options = getEditorOptions(isReadOnly);

    // 로딩 중 표시
    if (isLoading && !isInitialized) {
        return (
            <div className={styles.loadingContainer}>
                코드 로딩 중...
            </div>
        );
    }

    return (
        <PanelGroup direction="vertical" className={`${styles.relative} ${styles.editorWrapper}`}>
            {/* 읽기 전용 배지 */}
            {!isInstructor && isReadOnly && (
                <div className={styles.readOnlyBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    읽기 전용
                </div>
            )}

            {/* 에디터 패널 */}
            <Panel defaultSize={70} minSize={30}>
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={handleCodeChange}
                    onMount={handleEditorMount}
                    options={options}
                    theme="vs-dark"
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
                            {/* 실행 버튼 */}
                            <button onClick={run} className={styles.runButton} title="코드 실행" disabled={!hasResult}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                </svg>
                            </button>

                            {/* 초기화 버튼 */}
                            <button
                                onClick={handleReset}
                                className={styles.resetButton}
                                disabled={isReadOnly}
                                title="코드 초기화"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                            </button>

                            {/* 복사 버튼 */}
                            <button onClick={copy} className={styles.copyButton} title="코드 복사">
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
    );
};

export default CodePanel;