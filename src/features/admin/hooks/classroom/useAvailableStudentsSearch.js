import { useState, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 클래스에 속하지 않은 학생 검색을 관리하는 커스텀 훅
 *
 * 사용 예시:
 * const { students, loading, searchStudents } = useAvailableStudentsSearch(classId);
 * searchStudents('김철수');
 *
 * @param {number|string} classId - 클래스 ID
 */
const useAvailableStudentsSearch = (classId) => {
    // ============ 데이터 상태 ============
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============ 검색 함수 ============
    /**
     * 클래스 미배정 학생 검색 (이름 또는 이메일)
     *
     * @param {string} keyword - 검색 키워드 (이름 또는 이메일)
     * @returns {Promise<Array>} 검색된 학생 목록
     */
    const searchStudents = useCallback(async (keyword = '') => {
        if (!classId) {
            console.warn('classId가 없습니다.');
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.searchAvailableStudents(classId, keyword);

            // api.js 인터셉터가 response.data 반환
            // 실제 학생 배열은 response.data에 있음
            const studentList = response.data || [];

            setStudents(studentList);
            return studentList;
        } catch (err) {
            console.error('학생 검색 실패:', err);
            const errorMsg = err.message || '학생 검색에 실패했습니다.';
            setError(errorMsg);
            setStudents([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, [classId]);

    // ============ 초기화 함수 ============
    /**
     * 검색 결과 초기화
     */
    const reset = useCallback(() => {
        setStudents([]);
        setError(null);
    }, []);

    // ============ 반환 ============
    return {
        // 데이터
        students,
        loading,
        error,

        // 함수
        searchStudents,
        reset
    };
};

export default useAvailableStudentsSearch;
