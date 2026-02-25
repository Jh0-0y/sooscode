// hooks/useAdminUserEdit.js
import { useState, useCallback } from 'react';
import { adminUserApi } from '../../services/adminUserApi';

/**
 * 관리자 - 사용자 정보 수정 훅
 * @param {Object} options - 옵션
 * @param {Function} options.onSuccess - 수정 성공 시 콜백
 * @param {Function} options.onError - 수정 실패 시 콜백
 */
export const useAdminUserEdit = (options = {}) => {
    const { onSuccess, onError } = options;

    // 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    /**
     * 편집 모드 시작
     */
    const startEdit = useCallback(() => {
        setIsEditing(true);
        setError(null);
    }, []);

    /**
     * 편집 모드 취소
     */
    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        setError(null);
    }, []);

    /**
     * 사용자 정보 수정 요청
     * @param {string} userId - 사용자 ID
     * @param {Object} data - 수정할 데이터 (name, email, role 등)
     */
    const updateUser = useCallback(async (userId, data) => {
        if (!userId) {
            setError('사용자 ID가 필요합니다.');
            return { success: false, error: '사용자 ID가 필요합니다.' };
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await adminUserApi.updateUser(userId, data);

            setIsEditing(false);
            setIsSubmitting(false);

            onSuccess?.(response);

            return { success: true, data: response };
        } catch (err) {
            const errorMessage = err.response?.data?.message
                || err.message
                || '사용자 정보 수정에 실패했습니다.';

            setError(errorMessage);
            setIsSubmitting(false);

            onError?.(err);

            return { success: false, error: errorMessage };
        }
    }, [onSuccess, onError]);

    /**
     * 사용자 역할 변경
     * @param {string} userId - 사용자 ID
     * @param {string} role - 변경할 역할
     */
    const changeRole = useCallback(async (userId, role) => {
        if (!userId) {
            setError('사용자 ID가 필요합니다.');
            return { success: false, error: '사용자 ID가 필요합니다.' };
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await adminUserApi.changeUserRole(userId, role);

            setIsSubmitting(false);

            onSuccess?.(response);

            return { success: true, data: response };
        } catch (err) {
            const errorMessage = err.response?.data?.message
                || err.message
                || '역할 변경에 실패했습니다.';

            setError(errorMessage);
            setIsSubmitting(false);

            onError?.(err);

            return { success: false, error: errorMessage };
        }
    }, [onSuccess, onError]);

    /**
     * 에러 초기화
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // 상태
        isEditing,
        isSubmitting,
        error,

        // 액션
        startEdit,
        cancelEdit,
        updateUser,
        changeRole,
        clearError,
    };
};

export default useAdminUserEdit;