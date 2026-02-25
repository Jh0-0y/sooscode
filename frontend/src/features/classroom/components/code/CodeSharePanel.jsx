import { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styles from './CodePanel.module.css';
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import { useMonacoEditor } from "@/features/classroom/hooks/code/useMonacoEditor.js";
import { useCodeExecution } from "@/features/classroom/hooks/code/useCodeExecution.js";
import { getEditorOptions } from "@/features/classroom/utils/editorUtils.js";
import { useSelectedStudent } from "@/features/classroom/hooks/class/useSelectedStudent.js";
import { useInstructorCode, useStudentCodeViewer } from "@/features/classroom/hooks/code/useCode.js";

/**
 * 코드 공유 패널 (읽기 전용 / 강사는 편집 가능)
 *
 * - 학생: useInstructorCode로 강사 코드 수신 (읽기 전용)
 * - 강사: useStudentCodeViewer로 선택한 학생 코드 보기/수정
 */
const CodeSharePanel = () => {
    const { classId, isInstructor } = useClassroomContext();
    const { isConnected } = useSocketContext();

    return isInstructor ? (
        <InstructorCodeSharePanel classId={classId} isConnected={isConnected} />
    ) : (
        <StudentCodeSharePanel classId={classId} isConnected={isConnected} />
    );
};

/**
 * 학생용: 강사 코드 보기 (읽기 전용)
 */
const StudentCodeSharePanel = ({ classId, isConnected }) => {
    const { editorInstance, handleEditorMount } = useMonacoEditor();

    // 강사 코드 수신 훅
    const { code, language, isLoading } = useInstructorCode({
        classId,
        isConnected,
        enabled: true,
    });

    // 코드 실행
    const { output, run, copy } = useCodeExecution(code);

    const options = getEditorOptions(true); // 항상 읽기 전용

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                강사 코드 로딩 중...
            </div>
        );
    }

    return (
        <div className={`${styles.relative} ${styles.editorWrapper}`}>

            {/* 읽기 전용 배지 */}
            <div className={styles.readOnlyBadge}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                읽기 전용
            </div>

            <PanelGroup direction="vertical">
                {/* 에디터 패널 */}
                <Panel defaultSize={70} minSize={30}>
                    <Editor
                        language={language}
                        value={code || '// 강사 코드를 기다리는 중...'}
                        options={{
                            ...options,
                            readOnly: true,
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

/**
 * 강사용: 학생 코드 보기/수정
 */
const InstructorCodeSharePanel = ({ classId, isConnected }) => {
    const { selectedStudent } = useSelectedStudent();
    const { editorInstance, handleEditorMount } = useMonacoEditor();

    // 학생 코드 보기/수정 훅
    const {
        selectedStudentId,
        studentCode,
        studentLanguage,
        isLoading,
        selectStudent,
        clearSelection,
    } = useStudentCodeViewer({
        classId,
        isConnected,
        debounceDelay: 300,
    });

    // 코드 실행
    const { output, run, copy, hasResult, isRunning } = useCodeExecution(studentCode);

    // 사이드바에서 선택한 학생과 동기화
    useEffect(() => {
        if (selectedStudent?.userId) {
            selectStudent(selectedStudent.userId);
        } else {
            clearSelection();
        }
    }, [selectedStudent?.userId, selectStudent, clearSelection]);

    // 학생 선택 여부
    const hasSelectedStudent = !!selectedStudent;

    return (
        <div className={`${styles.relative} ${styles.editorWrapper}`}>

            {/* 선택 안내 메시지 */}
            {!hasSelectedStudent && (
                <div className={styles.selectionGuide}>
                    ← 왼쪽 사이드바에서 학생을 선택하세요
                </div>
            )}

            {/* 편집 가능/읽기 전용 배지 */}
            {hasSelectedStudent ? (
                <div className={styles.readOnlyBadge}>
                    {selectedStudent && (
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {selectedStudent.username}의 코드
                    </span>
                    )}
                </div>
            ) : (
             <div />
            )}

            {isLoading && (
                <div className={styles.loadingOverlay}>
                    로딩 중...
                </div>
            )}

            <PanelGroup direction="vertical">
                {/* 에디터 패널 */}
                <Panel defaultSize={70} minSize={30}>
                    <Editor
                        language={studentLanguage}
                        value={
                            studentCode ||
                            (hasSelectedStudent
                                    ? `// ${selectedStudent.username}의 코드를 기다리는 중...`
                                    : '// 왼쪽 사이드바에서 학생을 선택하세요'
                            )
                        }
                        options={{
                            ...getEditorOptions(true),
                            readOnly: true,
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
                                <button onClick={run} className={styles.runButton}  disabled={!hasResult}>
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