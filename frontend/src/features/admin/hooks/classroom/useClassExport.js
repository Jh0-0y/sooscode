import { useState, useCallback } from 'react';
import { adminClassApi, downloadFile } from '../../services/adminClassApi';
import { useError } from '@/hooks/useError';
import { useToast } from '@/hooks/useToast';

/**
 * 클래스 엑셀 다운로드 훅
 */
export const useClassExport = () => {
    const { handleError } = useError();
    const toast = useToast();
    const [isExporting, setIsExporting] = useState(false);

    /**
     * 단일 클래스 엑셀 다운로드 (클래스 정보 + 수강생 목록)
     */
    const exportClass = useCallback(async (classId) => {
        setIsExporting(true);
        try {
            const blob = await adminClassApi.exportClassToExcel(classId);
            const filename = `class_${classId}_${new Date().toISOString().split('T')[0]}.xlsx`;

            downloadFile(blob, filename);
            toast.success('엑셀 파일이 다운로드되었습니다.');

            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsExporting(false);
        }
    }, [toast, handleError]);

    /**
     * 클래스 목록 엑셀 다운로드
     */
    const exportClassList = useCallback(async (filter = {}) => {
        setIsExporting(true);
        try {
            const blob = await adminClassApi.exportClassListToExcel(filter);
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const filename = `classes_${today}.xlsx`;

            downloadFile(blob, filename);
            toast.success('엑셀 파일이 다운로드되었습니다.');

            return true;
        } catch (error) {
            console.error('클래스 목록 엑셀 다운로드 실패:', error);
            handleError(error);
            return false;
        } finally {
            setIsExporting(false);
        }
    }, [toast, handleError]);

    return {
        isExporting,
        exportClass,
        exportClassList
    };
};

export default useClassExport;