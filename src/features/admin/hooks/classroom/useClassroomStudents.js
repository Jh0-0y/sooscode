import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 학생 배정/해제 로직을 관리하는 커스텀 훅
 */
const useClassroomStudents = (options = {}) => {
    const { onAssignSuccess, onRemoveSuccess, onError } = options;

    const [isAssigning, setIsAssigning] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    // 학생 배정
    const assignStudents = useCallback(async (classId, studentIds) => {
        if (!classId || !studentIds?.length) {
            onError?.('배정할 학생 정보가 없습니다.');
            return { success: false };
        }

        setIsAssigning(true);

        try {
            const response = await adminClassApi.assignStudents(classId, studentIds);
            onAssignSuccess?.(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '학생 배정에 실패했습니다.';
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsAssigning(false);
        }
    }, [onAssignSuccess, onError]);

    // 학생 배정 해제
    const removeStudents = useCallback(async (classId, studentIds) => {
        if (!classId || !studentIds?.length) {
            onError?.('해제할 학생 정보가 없습니다.');
            return { success: false };
        }

        setIsRemoving(true);

        try {
            const response = await adminClassApi.removeStudents(classId, studentIds);
            onRemoveSuccess?.(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '학생 배정 해제에 실패했습니다.';
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsRemoving(false);
        }
    }, [onRemoveSuccess, onError]);

    return {
        isAssigning,
        isRemoving,
        assignStudents,
        removeStudents,
    };
};

export default useClassroomStudents;