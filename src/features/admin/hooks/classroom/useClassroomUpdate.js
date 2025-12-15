import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 수정 로직을 관리하는 커스텀 훅
 */
export const useClassroomUpdate = (options = {}) => {
    const { onSuccess, onError } = options;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [targetClass, setTargetClass] = useState(null);

    const openModal = useCallback((classData) => {
        setTargetClass(classData);
        setIsModalOpen(true);
        setSubmitError(null);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSubmitError(null);
        setTargetClass(null);
    }, []);

    const handleSubmit = useCallback(async (formData) => {
        if (!targetClass?.classId) {
            const errorMsg = '수정할 클래스 정보가 없습니다.';
            setSubmitError(errorMsg);
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await adminClassApi.update(targetClass.classId, formData);

            closeModal();
            onSuccess?.(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '클래스 수정에 실패했습니다.';
            setSubmitError(errorMsg);
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsSubmitting(false);
        }
    }, [targetClass, closeModal, onSuccess, onError]);

    return {
        isModalOpen,
        openModal,
        closeModal,
        isSubmitting,
        submitError,
        targetClass,
        handleSubmit,
    };
};

/**
 * 클래스 삭제 로직을 관리하는 커스텀 훅
 */
export const useClassroomDelete = (options = {}) => {
    const { onSuccess, onError } = options;

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [targetClass, setTargetClass] = useState(null);

    const openConfirm = useCallback((classData) => {
        setTargetClass(classData);
        setIsConfirmOpen(true);
    }, []);

    const closeConfirm = useCallback(() => {
        setIsConfirmOpen(false);
        setTargetClass(null);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!targetClass?.classId) {
            onError?.('삭제할 클래스 정보가 없습니다.');
            return { success: false };
        }

        setIsDeleting(true);

        try {
            await adminClassApi.delete(targetClass.classId);

            closeConfirm();
            onSuccess?.(targetClass.classId);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '클래스 삭제에 실패했습니다.';
            onError?.(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsDeleting(false);
        }
    }, [targetClass, closeConfirm, onSuccess, onError]);

    return {
        isConfirmOpen,
        openConfirm,
        closeConfirm,
        isDeleting,
        targetClass,
        handleDelete,
    };
};