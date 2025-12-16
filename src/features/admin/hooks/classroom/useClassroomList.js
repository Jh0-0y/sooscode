import { useState, useEffect, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

const DEFAULT_PAGE_SIZE = 10;

/**
 * 클래스 목록 조회, 필터링, 페이지네이션을 관리하는 커스텀 훅
 * Props drilling 방식으로 설계됨
 */
const useClassroomList = (options = {}) => {
    const { pageSize = DEFAULT_PAGE_SIZE } = options;

    // ============ 데이터 상태 ============
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false); // 재조회 로딩
    const [initialLoading, setInitialLoading] = useState(true); // 초기 로딩
    const [error, setError] = useState(null);

    // ============ 페이지네이션 상태 ============
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: pageSize
    });

    // ============ 필터 상태 (통합) ============
    const [filters, setFilters] = useState({
        keyword: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        classType: 'all',
        sortBy: 'createdAt',
        sortDirection: 'DESC'
    });

    // ============ API 호출 함수 ============
    /**
     * 클래스 목록 조회
     * 현재 필터와 페이지 상태를 기반으로 API 호출
     */
    const fetchClasses = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.getList({
                page: pagination.currentPage,
                size: pagination.pageSize,
                keyword: filters.keyword || undefined,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined,
                startTime: filters.startTime || undefined,
                endTime: filters.endTime || undefined,
                sortBy: filters.sortBy,
                sortDirection: filters.sortDirection
            });

            // AdminPageResponse 구조 (api.js 인터셉터가 response.data 반환)
            // response = { success, status, code, message, data: { contents, currentPage, ... } }
            const { contents, currentPage, totalPages, totalElements } = response.data;

            setClasses(contents);
            setPagination(prev => ({
                ...prev,
                currentPage: currentPage,
                totalPages,
                totalElements
            }));
        } catch (err) {
            console.error('클래스 목록 조회 실패:', err);
            setError(err.message || '데이터를 불러오는데 실패했습니다.');
            setClasses([]);
        } finally {
            setLoading(false);
            setInitialLoading(false); // 첫 로딩 완료
        }
    }, [filters, pagination.currentPage, pagination.pageSize]);

    // ============ 초기 로드 ============
    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    // ============ 검색 핸들러 ============
    /**
     * 검색어로 검색
     * 페이지를 0으로 초기화하고 검색 실행
     */
    const handleSearch = useCallback((keyword) => {
        setFilters(prev => ({ ...prev, keyword }));
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, []);

    // ============ 통합 필터 핸들러 ============
    /**
     * 필터 변경 (날짜, 시간, 타입 등)
     * 페이지를 0으로 초기화하고 필터 적용
     */
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, []);

    // ============ 정렬 핸들러 ============
    /**
     * 정렬 변경
     * 페이지를 0으로 초기화하고 정렬 적용
     */
    const handleSortChange = useCallback((sortBy, sortDirection) => {
        setFilters(prev => ({ ...prev, sortBy, sortDirection }));
        setPagination(prev => ({ ...prev, currentPage: 0 }));
    }, []);

    // ============ 초기화 핸들러 ============
    /**
     * 모든 필터 초기화
     */
    const handleReset = useCallback(() => {
        setFilters({
            keyword: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            classType: 'all',
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
     * 새 클래스를 목록 맨 앞에 추가 (생성 후 즉시 반영용)
     */
    const addClassToList = useCallback((newClass) => {
        setClasses(prev => [newClass, ...prev]);
        setPagination(prev => ({
            ...prev,
            totalElements: prev.totalElements + 1
        }));
    }, []);

    /**
     * 목록에서 클래스 정보 업데이트 (수정 후 즉시 반영용)
     */
    const updateClassInList = useCallback((classId, updatedData) => {
        setClasses(prev =>
            prev.map(cls =>
                cls.classId === classId ? { ...cls, ...updatedData } : cls
            )
        );
    }, []);

    /**
     * 목록에서 클래스 제거 (삭제 후 즉시 반영용)
     */
    const removeClassFromList = useCallback((classId) => {
        setClasses(prev => prev.filter(cls => cls.classId !== classId));
        setPagination(prev => ({
            ...prev,
            totalElements: prev.totalElements - 1
        }));
    }, []);

    // ============ 반환 ============
    return {
        // 데이터
        classes,
        loading,          // 재조회 시 로딩 (테이블에서 사용)
        initialLoading,   // 첫 로딩 (전체 페이지에서 사용)
        error,

        // 필터 상태 (컴포넌트에 props로 전달용)
        filters,

        // 페이지네이션 상태 (컴포넌트에 props로 전달용)
        pagination,

        // 핸들러 (컴포넌트에 props로 전달용)
        handleSearch,
        handleFilterChange,
        handleSortChange,
        handleReset,
        handlePageChange,
        handlePageSizeChange,

        // 유틸리티
        refetch: fetchClasses,
        addClassToList,
        updateClassInList,
        removeClassFromList
    };
};

export default useClassroomList;