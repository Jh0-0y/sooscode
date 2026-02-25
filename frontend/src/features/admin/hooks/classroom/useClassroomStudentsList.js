import { useState, useEffect, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

const DEFAULT_PAGE_SIZE = 5;

/**
 * 클래스별 학생 목록 조회를 관리하는 커스텀 훅
 *
 * @param {number|string} classId - 클래스 ID
 * @param {Object} options - 옵션
 * @param {number} options.pageSize - 페이지 사이즈 (기본값: 5)
 */
const useClassroomStudentsList = (classId, options = {}) => {
    const { pageSize = DEFAULT_PAGE_SIZE } = options;

    // ============ 데이터 상태 ============
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============ 페이지네이션 상태 ============
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: pageSize
    });

    // ============ 필터 상태 ============
    const [filters, setFilters] = useState({
        keyword: '',
        sortBy: 'createdAt',
        sortDirection: 'DESC'
    });

    // ============ API 호출 함수 ============
    /**
     * 학생 목록 조회
     */
    const fetchStudents = useCallback(async () => {
        if (!classId) {
            setStudents([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.getClassStudents(classId, {
                page: pagination.currentPage,
                size: pagination.pageSize,
                keyword: filters.keyword || undefined,
                sortBy: filters.sortBy,
                sortDirection: filters.sortDirection
            });

            // AdminPageResponse 구조
            const { contents, currentPage, totalPages, totalElements } = response.data;

            setStudents(contents);
            setPagination(prev => ({
                ...prev,
                currentPage: currentPage,
                totalPages,
                totalElements
            }));
        } catch (err) {
            console.error('학생 목록 조회 실패:', err);
            setError(err.message || '학생 목록을 불러오는데 실패했습니다.');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }, [classId, filters, pagination.currentPage, pagination.pageSize]);

    // ============ 초기 로드 및 의존성 변경 시 재조회 ============
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // ============ 검색 핸들러 ============
    /**
     * 학생 검색 (이름 또는 이메일)
     */
    const handleSearch = useCallback((keyword) => {
        setFilters(prev => ({ ...prev, keyword }));
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, []);

    // ============ 정렬 핸들러 ============
    /**
     * 정렬 변경
     */
    const handleSortChange = useCallback((sortBy, sortDirection) => {
        setFilters(prev => ({ ...prev, sortBy, sortDirection }));
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, []);

    // ============ 초기화 핸들러 ============
    /**
     * 필터 초기화
     */
    const handleReset = useCallback(() => {
        setFilters({
            keyword: '',
            sortBy: 'createdAt',
            sortDirection: 'DESC'
        });
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, []);

    // ============ 페이지네이션 핸들러 ============
    /**
     * 페이지 변경
     */
    const handlePageChange = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    }, []);

    /**
     * 페이지 사이즈 변경
     */
    const handlePageSizeChange = useCallback((newSize) => {
        setPagination(prev => ({
            ...prev,
            pageSize: newSize,
            currentPage: 0
        }));
    }, []);

    // ============ 로컬 상태 업데이트 유틸리티 ============
    /**
     * 학생 추가 (배정 후 즉시 반영용)
     */
    const addStudentsToList = useCallback((newStudents) => {
        setStudents(prev => [...newStudents, ...prev]);
        setPagination(prev => ({
            ...prev,
            totalElements: prev.totalElements + newStudents.length
        }));
    }, []);

    /**
     * 학생 제거 (배정 해제 후 즉시 반영용)
     */
    const removeStudentsFromList = useCallback((studentIds) => {
        setStudents(prev => prev.filter(student => !studentIds.includes(student.userId)));
        setPagination(prev => ({
            ...prev,
            totalElements: prev.totalElements - studentIds.length
        }));
    }, []);

    // ============ 반환 ============
    return {
        // 데이터
        students,
        loading,
        error,

        // 필터 상태
        filters,

        // 페이지네이션 상태
        pagination,

        // 핸들러
        handleSearch,
        handleSortChange,
        handleReset,
        handlePageChange,
        handlePageSizeChange,

        // 유틸리티
        refetch: fetchStudents,
        addStudentsToList,
        removeStudentsFromList
    };
};

export default useClassroomStudentsList;
