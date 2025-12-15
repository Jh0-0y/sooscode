import { useState, useEffect, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스 상세 정보 조회를 관리하는 커스텀 훅
 * @param {number|string} classId - 조회할 클래스 ID
 */
const useClassroomDetail = (classId) => {
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetail = useCallback(async () => {
        if (!classId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.getDetail(classId);
            setClassData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || '클래스 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    // 로컬 상태 업데이트 (수정 후 즉시 반영용)
    const updateLocalData = useCallback((updatedData) => {
        setClassData(prev => prev ? { ...prev, ...updatedData } : null);
    }, []);

    return {
        classData,
        loading,
        error,
        refetch: fetchDetail,
        updateLocalData,
    };
};

export default useClassroomDetail;