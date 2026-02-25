import { useState, useEffect, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 상세 정보 조회를 관리하는 커스텀 훅
 *
 * @param {number|string} classId - 조회할 클래스 ID
 */
const useClassroomDetail = (classId) => {
    // ============ 상태 관리 ============
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ============ API 호출 함수 ============
    /**
     * 클래스 상세 정보 조회
     */
    const fetchDetail = useCallback(async () => {
        if (!classId) {
            setLoading(false);
            setError('클래스 ID가 없습니다.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.getDetail(classId);
            setClassData(response.data);
        } catch (err) {
            console.error('클래스 상세 조회 실패:', err);
            setError(err.response?.data?.message || err.message || '클래스 정보를 불러오는데 실패했습니다.');
            setClassData(null);
        } finally {
            setLoading(false);
        }
    }, [classId]);

    // ============ 초기 로드 ============
    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    // ============ 로컬 상태 업데이트 유틸리티 ============
    /**
     * 로컬 데이터 업데이트 (수정 후 즉시 반영용)
     * API 재호출 없이 로컬 상태만 업데이트
     */
    const updateLocalData = useCallback((updatedData) => {
        setClassData(prev => prev ? { ...prev, ...updatedData } : null);
    }, []);

    // ============ 반환 ============
    return {
        // 데이터
        classData,
        loading,
        error,

        // 유틸리티
        refetch: fetchDetail,
        updateLocalData
    };
};

export default useClassroomDetail;