import { useState, useEffect, useCallback } from 'react';
import { adminClassApi } from '../../services/adminClassApi';

const DEFAULT_PAGE_SIZE = 10;

/**
 * 클래스 목록 조회, 필터링, 페이지네이션을 관리하는 커스텀 훅
 * 서버 사이드 페이지네이션 적용
 */
const useClassroomList = (options = {}) => {
    const { pageSize = DEFAULT_PAGE_SIZE } = options;

    // 데이터 상태
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 페이지네이션 상태 (서버에서 받아옴)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 필터/정렬 상태
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('DESC');

    // 데이터 로드
    const fetchClasses = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminClassApi.getList({
                page: params.page ?? currentPage,
                size: pageSize,
                keyword: params.keyword ?? keyword,
                startDate: params.startDate ?? startDate,
                endDate: params.endDate ?? endDate,
                sortBy: params.sortBy ?? sortBy,
                sortDirection: params.sortDirection ?? sortDirection,
            });

            // Spring Page 응답 구조
            const { content, totalPages: pages, totalElements: total, number } = response.data;

            setClasses(content);
            setTotalPages(pages);
            setTotalElements(total);
            setCurrentPage(number);
        } catch (err) {
            setError(err.response?.data?.message || err.message || '데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, keyword, startDate, endDate, sortBy, sortDirection]);

    // 초기 로드
    useEffect(() => {
        fetchClasses();
    }, []);

    // 페이지 변경
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        fetchClasses({ page });
    }, [fetchClasses]);

    // 검색 (페이지 초기화)
    const handleSearch = useCallback((newKeyword) => {
        setKeyword(newKeyword);
        setCurrentPage(0);
        fetchClasses({ keyword: newKeyword, page: 0 });
    }, [fetchClasses]);

    // 날짜 필터 변경
    const handleDateFilterChange = useCallback((newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setCurrentPage(0);
        fetchClasses({ startDate: newStartDate, endDate: newEndDate, page: 0 });
    }, [fetchClasses]);

    // 정렬 변경
    const handleSortChange = useCallback((newSortBy, newSortDirection = 'DESC') => {
        setSortBy(newSortBy);
        setSortDirection(newSortDirection);
        setCurrentPage(0);
        fetchClasses({ sortBy: newSortBy, sortDirection: newSortDirection, page: 0 });
    }, [fetchClasses]);

    // 필터 초기화
    const resetFilters = useCallback(() => {
        setKeyword('');
        setStartDate('');
        setEndDate('');
        setSortBy('createdAt');
        setSortDirection('DESC');
        setCurrentPage(0);
        fetchClasses({
            keyword: '',
            startDate: '',
            endDate: '',
            sortBy: 'createdAt',
            sortDirection: 'DESC',
            page: 0
        });
    }, [fetchClasses]);

    // 로컬 상태 업데이트 (리페치 없이 UI 즉시 반영용)
    const addClassToList = useCallback((newClass) => {
        setClasses(prev => [newClass, ...prev]);
        setTotalElements(prev => prev + 1);
    }, []);

    const updateClassInList = useCallback((classId, updatedData) => {
        setClasses(prev =>
            prev.map(cls =>
                cls.classId === classId ? { ...cls, ...updatedData } : cls
            )
        );
    }, []);

    const removeClassFromList = useCallback((classId) => {
        setClasses(prev => prev.filter(cls => cls.classId !== classId));
        setTotalElements(prev => prev - 1);
    }, []);

    return {
        // 데이터
        classes,
        totalElements,

        // 상태
        loading,
        error,

        // 필터 값
        keyword,
        startDate,
        endDate,
        sortBy,
        sortDirection,

        // 필터 핸들러
        onSearch: handleSearch,
        onDateFilterChange: handleDateFilterChange,
        onSortChange: handleSortChange,
        resetFilters,

        // 페이지네이션
        currentPage,
        totalPages,
        pageSize,
        onPageChange: handlePageChange,

        // 유틸리티
        refetch: fetchClasses,
        addClassToList,
        updateClassInList,
        removeClassFromList,
    };
};

export default useClassroomList;