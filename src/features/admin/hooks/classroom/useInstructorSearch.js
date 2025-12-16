import { useState, useCallback, useRef } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

/**
 * 강사 검색을 관리하는 커스텀 훅 (무한 스크롤 지원)
 *
 * 사용 예시:
 * const { instructors, loading, hasMore, searchInstructors, loadMore } = useInstructorSearch();
 * searchInstructors('홍길동');
 * loadMore(); // 다음 페이지 로드
 */
const useInstructorSearch = () => {
    // ============ 데이터 상태 ============
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // 페이지네이션 상태
    const currentPageRef = useRef(0);
    const currentKeywordRef = useRef('');
    const pageSizeRef = useRef(20);

    // ============ 검색 함수 (초기 검색) ============
    /**
     * 강사 검색 (이름 또는 이메일)
     *
     * @param {string} keyword - 검색 키워드 (이름 또는 이메일)
     * @returns {Promise<Array>} 검색된 강사 목록
     */
    const searchInstructors = useCallback(async (keyword = '') => {
        setLoading(true);
        setError(null);
        currentPageRef.current = 0;
        currentKeywordRef.current = keyword;

        try {
            const response = await adminClassApi.searchInstructors(
                keyword,
                { page: 0, size: pageSizeRef.current }
            );

            const instructorList = response.data || [];

            setInstructors(instructorList);
            setHasMore(instructorList.length >= pageSizeRef.current);

            return instructorList;
        } catch (err) {
            console.error('강사 검색 실패:', err);
            const errorMsg = err.message || '강사 검색에 실패했습니다.';
            setError(errorMsg);
            setInstructors([]);
            setHasMore(false);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // ============ 더보기 함수 (무한 스크롤용) ============
    /**
     * 다음 페이지 로드
     */
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) {
            return;
        }

        setLoading(true);
        const nextPage = currentPageRef.current + 1;

        try {
            const response = await adminClassApi.searchInstructors(
                currentKeywordRef.current,
                { page: nextPage, size: pageSizeRef.current }
            );

            const newInstructors = response.data || [];

            if (newInstructors.length > 0) {
                setInstructors(prev => [...prev, ...newInstructors]);
                currentPageRef.current = nextPage;
                setHasMore(newInstructors.length >= pageSizeRef.current);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('강사 추가 로드 실패:', err);
            setError(err.message || '강사 목록을 더 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    // ============ 초기화 함수 ============
    /**
     * 검색 결과 초기화
     */
    const reset = useCallback(() => {
        setInstructors([]);
        setError(null);
        setHasMore(true);
        currentPageRef.current = 0;
        currentKeywordRef.current = '';
    }, []);

    // ============ 반환 ============
    return {
        // 데이터
        instructors,
        loading,
        error,
        hasMore,

        // 함수
        searchInstructors,
        loadMore,
        reset
    };
};

export default useInstructorSearch;