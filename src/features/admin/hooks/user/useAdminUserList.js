// hooks/useAdminUserList.js
import { useState, useEffect } from 'react';
import { useAdminUser } from './useAdminUser';
import { useUserFilterStore } from './useUserFilterStore';

/**
 * 사용자 목록 조회 전용 훅
 * Zustand로 필터링 상태 관리
 */
export const useAdminUserList = () => {
    const { loading, getUserList, exportUsersToExcel } = useAdminUser();

    // Zustand에서 필터 상태 가져오기
    const {
        page,
        size,
        keyword,
        role,
        status,
        startDate,
        endDate,
        sortBy,
        sortDirection,
        setPage,
        setSize,
        setKeyword,
        setRole,
        setStatus,
        setDateRange,
        setSort,
        resetFilters,
        getFilterParams,
    } = useUserFilterStore();

    // 목록 데이터
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    /**
     * 사용자 목록 조회
     */
    const fetchUsers = async () => {
        const params = getFilterParams();
        const data = await getUserList(params);

        if (data) {
            setUsers(data.contents || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        }
    };

    /**
     * 현재 필터 조건으로 엑셀 다운로드
     */
    const handleExcelDownload = async () => {
        const params = getFilterParams();
        await exportUsersToExcel(params);
    };

    /**
     * 날짜 범위 변경 핸들러 (startDate, endDate를 각각 받음)
     */
    const handleDateRangeChange = (start, end) => {
        setDateRange(start, end);
    };

    // 필터 조건이 변경될 때마다 자동 조회
    useEffect(() => {
        fetchUsers();
    }, [page, size, keyword, role, status, startDate, endDate, sortBy, sortDirection]);

    return {
        // 데이터
        users,
        totalPages,
        totalElements,
        loading,

        // 페이지네이션
        page,
        size,
        handlePageChange: setPage,
        handleSizeChange: setSize,

        // 필터링
        keyword,
        role,
        status,
        startDate,
        endDate,
        handleKeywordChange: setKeyword,
        handleRoleChange: setRole,
        handleStatusChange: setStatus,
        handleDateRangeChange,

        // 정렬
        sortBy,
        sortDirection,
        handleSortChange: setSort,

        // 기타
        resetFilters,
        refetch: fetchUsers,
        handleExcelDownload,
    };
};

export default useAdminUserList;