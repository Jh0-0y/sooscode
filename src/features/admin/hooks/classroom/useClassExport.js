import { useState, useCallback } from 'react';
import { adminClassApi, downloadFile } from '@/services/adminClassApi';
import { useToast } from '@/hooks/useToast';

/**
 * 클래스 엑셀 다운로드 훅
 */
export const useClassExport = () => {
    const toast = useToast();
    const [isExporting, setIsExporting] = useState(false);

    /**
     * 단일 클래스 엑셀 다운로드 (클래스 정보 + 수강생 목록)
     * @param {number} classId - 클래스 ID
     * @param {string} [classTitle] - 파일명에 사용할 클래스 제목 (선택)
     */
    const exportClass = useCallback(async (classId, classTitle) => {
        if (isExporting) return;

        setIsExporting(true);
        try {
            const blob = await adminClassApi.exportClassToExcel(classId);

            // 파일명 생성
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const safeName = classTitle
                ? classTitle.replace(/[^a-zA-Z0-9가-힣]/g, '_').substring(0, 30)
                : `class_${classId}`;
            const filename = `${safeName}_${today}.xlsx`;

            downloadFile(blob, filename);
            toast.success('엑셀 파일이 다운로드되었습니다.');

            return true;
        } catch (error) {
            console.error('클래스 엑셀 다운로드 실패:', error);
            toast.error('엑셀 다운로드에 실패했습니다.');
            return false;
        } finally {
            setIsExporting(false);
        }
    }, [isExporting, toast]);

    /**
     * 클래스 목록 엑셀 다운로드
     * @param {Object} [filter] - 필터 조건
     * @param {string} [filter.keyword] - 검색어
     * @param {string} [filter.startDate] - 시작일
     * @param {string} [filter.endDate] - 종료일
     * @param {string} [filter.sortBy] - 정렬 기준
     * @param {string} [filter.sortDirection] - 정렬 방향
     */
    const exportClassList = useCallback(async (filter = {}) => {
        if (isExporting) return;

        setIsExporting(true);
        try {
            const blob = await adminClassApi.exportClassListToExcel(filter);

            // 파일명 생성
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const filename = `classes_${today}.xlsx`;

            downloadFile(blob, filename);
            toast.success('엑셀 파일이 다운로드되었습니다.');

            return true;
        } catch (error) {
            console.error('클래스 목록 엑셀 다운로드 실패:', error);
            toast.error('엑셀 다운로드에 실패했습니다.');
            return false;
        } finally {
            setIsExporting(false);
        }
    }, [isExporting, toast]);

    return {
        isExporting,
        exportClass,
        exportClassList
    };
};

export default useClassExport;