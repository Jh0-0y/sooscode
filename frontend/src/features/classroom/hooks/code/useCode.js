import { useEffect, useState, useCallback, useRef } from 'react';
import codeApi from '@/features/classroom/services/codeApi';

const DEFAULT_CODE = '// 코드를 작성하세요';

/**
 * 강사 코드 구독 훅 (학생용)
 * - 강사 코드 실시간 수신
 * - 초기 코드 로드
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 * @param {boolean} options.enabled - 활성화 여부 (학생만 true)
 */
export const useInstructorCode = ({
                                      classId,
                                      isConnected = false,
                                      enabled = true,
                                  } = {}) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('java');
    const [isLoading, setIsLoading] = useState(false);

    const mountedRef = useRef(true);

    // 코드 업데이트 핸들러
    const handleCodeUpdate = useCallback((data) => {
        if (!mountedRef.current) return;
        console.log('[useInstructorCode] 강사 코드 수신:', data);
        setCode(data.code || '');
        setLanguage(data.language || 'java');
    }, []);

    // 초기 코드 로드 및 구독
    useEffect(() => {
        if (!classId || !isConnected || !enabled) return;

        mountedRef.current = true;

        const init = async () => {
            setIsLoading(true);

            try {
                // 초기 코드 로드
                const response = await codeApi.getInstructorCode(classId);
                if (response && !response.empty && mountedRef.current) {
                    setCode(response.code || '');
                    setLanguage(response.language || 'javascript');
                }
            } catch (error) {
                console.error('[useInstructorCode] 강사 코드 로드 실패:', error);
            } finally {
                if (mountedRef.current) {
                    setIsLoading(false);
                }
            }

            // 구독
            codeApi.subscribeInstructorCode(classId, handleCodeUpdate);
        };
        init();

        return () => {
            mountedRef.current = false;
            codeApi.unsubscribeInstructorCode(classId);
        };
    }, [classId, isConnected, enabled, handleCodeUpdate]);

    return {
        code,
        language,
        isLoading,
    };
};

/**
 * 학생 코드 전송 훅 (학생용)
 * - 내 코드 전송
 * - 강사가 수정한 코드 수신
 * - 초기 코드 로드 (새로고침 시 복원)
 * - 디바운스 적용
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {number} options.userId - 현재 유저 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 * @param {number} options.debounceDelay - 디바운스 딜레이 (ms)
 * @param {function} options.onCodeEdited - 강사가 코드 수정 시 콜백
 * @param {function} options.onInitialCodeLoaded - 초기 코드 로드 완료 콜백
 */
export const useStudentCodeSender = ({
                                         classId,
                                         userId,
                                         isConnected = false,
                                         debounceDelay = 300,
                                         onCodeEdited,
                                         onInitialCodeLoaded,
                                     } = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const mountedRef = useRef(true);
    const isFromInstructorRef = useRef(false); // 강사 수정으로 인한 변경인지 체크

    // 강사가 수정한 코드 수신 핸들러
    const handleCodeEdited = useCallback((data) => {
        console.log("강사 수정")
        if (!mountedRef.current) return;

        console.log('[useStudentCodeSender] 코드 수신:', data);

        // 내가 보낸 게 아닌 경우에만 (강사가 수정한 경우)
        // instructor 필드가 true이거나, userId가 다른 경우
        if (data.instructor || (data.userId && data.userId !== userId)) {
            console.log('[useStudentCodeSender] 강사가 수정한 코드 반영');
            isFromInstructorRef.current = true;
            onCodeEdited?.(data.code, data.language);

            // 플래그 리셋
            setTimeout(() => {
                isFromInstructorRef.current = false;
            }, 100);
        }
    }, [userId, onCodeEdited]);

    // 초기 코드 로드 + 내 코드 토픽 구독
    useEffect(() => {
        if (!classId || !userId || !isConnected) return;

        mountedRef.current = true;

        const init = async () => {
            setIsLoading(true);

            try {
                // 초기 코드 로드 (Redis에서)
                const response = await codeApi.getMyCode(classId, userId, false);
                if (response && !response.empty && mountedRef.current) {
                    console.log('[useStudentCodeSender] 초기 코드 로드:', response);
                    onInitialCodeLoaded?.(response.code, response.language);
                }
            } catch (error) {
                console.error('[useStudentCodeSender] 초기 코드 로드 실패:', error);
            } finally {
                if (mountedRef.current) {
                    setIsLoading(false);
                }
            }

            // 내 코드 토픽 구독 (강사가 수정한 내용 수신)
            codeApi.subscribeMyCode(classId, userId, handleCodeEdited);
        };

        init();

        return () => {
            mountedRef.current = false;
            codeApi.unsubscribeMyCode(classId);
        };
    }, [classId, userId, isConnected, handleCodeEdited, onInitialCodeLoaded]);

    // 코드 전송 (강사 수정으로 인한 변경이면 전송 안 함)
    const sendCode = useCallback((code, language) => {
        if (!classId || !isConnected) return;

        // 강사가 수정한 코드를 다시 전송하지 않음 (무한 루프 방지)
        if (isFromInstructorRef.current) {
            console.log('[useStudentCodeSender] 강사 수정 반영 중 - 전송 스킵');
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            codeApi.sendStudentCode(classId, code, language);
            timeoutRef.current = null;
        }, debounceDelay);
    }, [classId, isConnected, debounceDelay]);

    // cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { sendCode, isLoading };
};

/**
 * 강사 코드 전송 훅 (강사용)
 * - 내 코드 전송
 * - 초기 코드 로드 (새로고침 시 복원)
 * - 디바운스 적용
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 * @param {number} options.debounceDelay - 디바운스 딜레이 (ms)
 * @param {function} options.onInitialCodeLoaded - 초기 코드 로드 완료 콜백
 */
export const useInstructorCodeSender = ({
                                            classId,
                                            isConnected = false,
                                            debounceDelay = 300,
                                            onInitialCodeLoaded,
                                        } = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const mountedRef = useRef(true);

    // 초기 코드 로드
    useEffect(() => {
        if (!classId || !isConnected) return;

        mountedRef.current = true;

        const init = async () => {
            setIsLoading(true);

            try {
                // 초기 코드 로드 (Redis에서)
                const response = await codeApi.getMyCode(classId, null, true);
                if (response && !response.empty && mountedRef.current) {
                    console.log('[useInstructorCodeSender] 초기 코드 로드:', response);
                    onInitialCodeLoaded?.(response.code, response.language);
                }
            } catch (error) {
                console.error('[useInstructorCodeSender] 초기 코드 로드 실패:', error);
            } finally {
                if (mountedRef.current) {
                    setIsLoading(false);
                }
            }
        };

        init();

        return () => {
            mountedRef.current = false;
        };
    }, [classId, isConnected, onInitialCodeLoaded]);

    const sendCode = useCallback((code, language) => {
        if (!classId || !isConnected) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            codeApi.sendInstructorCode(classId, code, language);
            timeoutRef.current = null;
        }, debounceDelay);
    }, [classId, isConnected, debounceDelay]);

    // cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { sendCode, isLoading };
};

/**
 * 학생 코드 보기/수정 훅 (강사용)
 * - 특정 학생 코드 구독
 * - 학생 변경 시 자동 구독 전환
 * - 학생 코드 수정 기능
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 * @param {number} options.debounceDelay - 수정 시 디바운스 딜레이 (ms)
 */
export const useStudentCodeViewer = ({
                                         classId,
                                         isConnected = false,
                                         debounceDelay = 300,
                                     } = {}) => {
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [studentCode, setStudentCode] = useState('');
    const [studentLanguage, setStudentLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);

    const prevStudentIdRef = useRef(null);
    const editTimeoutRef = useRef(null);
    const mountedRef = useRef(true);

    // 코드 업데이트 핸들러
    const handleCodeUpdate = useCallback((data) => {
        if (!mountedRef.current) return;
        console.log('[useStudentCodeViewer] 학생 코드 수신:', data);
        setStudentCode(data.code || '');
        setStudentLanguage(data.language || 'javascript');
    }, []);

    // 학생 선택 변경
    const selectStudent = useCallback(async (studentId) => {
        if (!classId || !isConnected) return;
        if (studentId === selectedStudentId) return;

        setIsLoading(true);
        setSelectedStudentId(studentId);

        try {
            const initialCode = await codeApi.watchStudent(
                classId,
                studentId,
                prevStudentIdRef.current,
                handleCodeUpdate
            );

            if (mountedRef.current) {
                if (initialCode) {
                    setStudentCode(initialCode.code || '');
                    setStudentLanguage(initialCode.language || 'javascript');
                } else {
                    setStudentCode('// 아직 코드가 없습니다');
                    setStudentLanguage('javascript');
                }
            }

            prevStudentIdRef.current = studentId;
        } catch (error) {
            console.error('[useStudentCodeViewer] 학생 코드 로드 실패:', error);
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [classId, isConnected, selectedStudentId, handleCodeUpdate]);

    // 선택 해제
    const clearSelection = useCallback(() => {
        if (prevStudentIdRef.current && classId) {
            codeApi.unsubscribeStudentCode(classId, prevStudentIdRef.current);
        }
        setSelectedStudentId(null);
        setStudentCode('');
        prevStudentIdRef.current = null;
    }, [classId]);

    /**
     * 강사가 학생 코드 수정
     * - 해당 학생의 에디터에 실시간 반영됨
     */
    const editStudentCode = useCallback((code, language) => {
        if (!classId || !isConnected || !selectedStudentId) return;

        // 로컬 상태 즉시 업데이트
        setStudentCode(code);
        if (language) {
            setStudentLanguage(language);
        }

        // 디바운스하여 서버로 전송
        if (editTimeoutRef.current) {
            clearTimeout(editTimeoutRef.current);
        }

        editTimeoutRef.current = setTimeout(() => {
            codeApi.editStudentCode(
                classId,
                selectedStudentId,
                code,
                language || studentLanguage
            );
            editTimeoutRef.current = null;
        }, debounceDelay);
    }, [classId, isConnected, selectedStudentId, studentLanguage, debounceDelay]);

    // cleanup
    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            if (prevStudentIdRef.current && classId) {
                codeApi.unsubscribeStudentCode(classId, prevStudentIdRef.current);
            }
            if (editTimeoutRef.current) {
                clearTimeout(editTimeoutRef.current);
            }
        };
    }, [classId]);

    return {
        selectedStudentId,
        studentCode,
        studentLanguage,
        isLoading,
        selectStudent,
        clearSelection,
        editStudentCode,
    };
};

export default {
    useInstructorCode,
    useStudentCodeSender,
    useInstructorCodeSender,
    useStudentCodeViewer,
};