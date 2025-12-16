import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 강사 검색을 관리하는 커스텀 훅
 *
 * 사용 예시:
 * const { instructors, loading, searchInstructors } = useInstructorSearch();
 * searchInstructors('홍길동');
 */
const useInstructorSearch = () => {
    // ============ 데이터 상태 ============
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============ 검색 함수 ============
    /**
     * 강사 검색 (이름 또는 이메일)
     *
     * @param {string} keyword - 검색 키워드 (이름 또는 이메일)
     * @returns {Promise<Array>} 검색된 강사 목록
     */
    const searchInstructors = useCallback(async (keyword = '') => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.searchInstructors(keyword);

            // api.js 인터셉터가 response.data 반환
            // 실제 강사 배열은 response.data에 있음
            const instructorList = response.data || [];

            setInstructors(instructorList);
            return instructorList;
        } catch (err) {
            console.error('강사 검색 실패:', err);
            const errorMsg = err.message || '강사 검색에 실패했습니다.';
            setError(errorMsg);
            setInstructors([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // ============ 초기화 함수 ============
    /**
     * 검색 결과 초기화
     */
    const reset = useCallback(() => {
        setInstructors([]);
        setError(null);
    }, []);

    // ============ 반환 ============
    return {
        // 데이터
        instructors,
        loading,
        error,

        // 함수
        searchInstructors,
        reset
    };
};

export default useInstructorSearch;
