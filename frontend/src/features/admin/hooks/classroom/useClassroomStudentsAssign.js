import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 학생 배정/해제 로직을 관리하는 커스텀 훅
 *
 * @param {Object} options - 옵션
 * @param {Function} options.onAssignSuccess - 배정 성공 시 콜백 (배정 결과 전달)
 * @param {Function} options.onRemoveSuccess - 해제 성공 시 콜백 (해제 결과 전달)
 * @param {Function} options.onError - 에러 발생 시 콜백 (에러 메시지 전달)
 */
const useClassroomStudentsAssign = (options = {}) => {
    const { onAssignSuccess, onRemoveSuccess, onError } = options;

    // ============ 배정 상태 ============
    const [isAssigning, setIsAssigning] = useState(false);

    // ============ 해제 상태 ============
    const [isRemoving, setIsRemoving] = useState(false);

    // ============ 학생 배정 핸들러 ============
    /**
     * 학생 일괄 배정
     *
     * @param {number} classId - 클래스 ID
     * @param {number[]} studentIds - 배정할 학생 ID 배열
     * @returns {Object} { success: boolean, data?: object, error?: string }
     */
    const assignStudents = useCallback(async (classId, studentIds) => {
        if (!classId || !studentIds?.length) {
            onError?.('배정할 학생 정보가 없습니다.');
            return { success: false };
        }

        setIsAssigning(true);

        try {
            const response = await adminClassApi.assignStudents(classId, studentIds);

            // api.js 인터셉터가 response.data 반환
            // 실제 결과 데이터는 response.data에 있음
            const resultData = response.data;

            // 성공 콜백 호출
            onAssignSuccess?.(resultData);

            return { success: true, data: resultData };
        } catch (err) {
            console.error('학생 배정 실패:', err);
            const errorMsg = err.message || '학생 배정에 실패했습니다.';

            // 에러 콜백 호출
            onError?.(errorMsg);

            return { success: false, error: errorMsg };
        } finally {
            setIsAssigning(false);
        }
    }, [onAssignSuccess, onError]);

    // ============ 학생 배정 해제 핸들러 ============
    /**
     * 학생 일괄 배정 해제
     *
     * @param {number} classId - 클래스 ID
     * @param {number[]} studentIds - 해제할 학생 ID 배열
     * @returns {Object} { success: boolean, data?: object, error?: string }
     */
    const removeStudents = useCallback(async (classId, studentIds) => {
        if (!classId || !studentIds?.length) {
            onError?.('해제할 학생 정보가 없습니다.');
            return { success: false };
        }

        setIsRemoving(true);

        try {
            const response = await adminClassApi.removeStudents(classId, studentIds);

            // api.js 인터셉터가 response.data 반환
            // 실제 결과 데이터는 response.data에 있음
            const resultData = response.data;

            // 성공 콜백 호출
            onRemoveSuccess?.(resultData);

            return { success: true, data: resultData };
        } catch (err) {
            console.error('학생 배정 해제 실패:', err);
            const errorMsg = err.message || '학생 배정 해제에 실패했습니다.';

            // 에러 콜백 호출
            onError?.(errorMsg);

            return { success: false, error: errorMsg };
        } finally {
            setIsRemoving(false);
        }
    }, [onRemoveSuccess, onError]);

    // ============ 반환 ============
    return {
        // 상태
        isAssigning,
        isRemoving,

        // 핸들러
        assignStudents,
        removeStudents
    };
};

export default useClassroomStudentsAssign;
