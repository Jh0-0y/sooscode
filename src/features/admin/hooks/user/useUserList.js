// hooks/useAdminUserList.js
import { useState, useEffect } from 'react';
import { useAdminUser } from '@/hooks/useAdminUser';

/**
 * 사용자 목록 조회 전용 훅
 * 페이지네이션, 필터링, 정렬 상태를 관리
 */
export const useUserList = (initialParams = {}) => {
    const { loading, getUserList } = useAdminUser();

    // 페이지네이션 상태
    const [page, setPage] = useState(initialParams.page || 0);
    const [size, setSize] = useState(initialParams.size || 10);

    // 필터링 상태
    const [keyword, setKeyword] = useState(initialParams.keyword || '');
    const [role, setRole] = useState(initialParams.role || '');
    const [status, setStatus] = useState(initialParams.status || '');
    const [startDate, setStartDate] = useState(initialParams.startDate || '');
    const [endDate, setEndDate] = useState(initialParams.endDate || '');

    // 정렬 상태
    const [sortBy, setSortBy] = useState(initialParams.sortBy || 'createdAt');
    const [sortDirection, setSortDirection] = useState(initialParams.sortDirection || 'DESC');

    // 목록 데이터
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    /**
     * 사용자 목록 조회
     */
    const fetchUsers = async () => {
        const params = {
            page,
            size,
            ...(keyword && { keyword }),
            ...(role && { role }),
            ...(status && { status }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            sortBy,
            sortDirection,
        };

        const data = await getUserList(params);

        if (data) {
            setUsers(data.contents);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        }
    };

    /**
     * 페이지 변경
     */
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    /**
     * 페이지 크기 변경
     */
    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(0); // 페이지 크기 변경 시 첫 페이지로
    };

    /**
     * 검색어 변경
     */
    const handleKeywordChange = (newKeyword) => {
        setKeyword(newKeyword);
        setPage(0); // 검색 시 첫 페이지로
    };

    /**
     * 역할 필터 변경
     */
    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setPage(0);
    };

    /**
     * 상태 필터 변경
     */
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        setPage(0);
    };

    /**
     * 날짜 필터 변경
     */
    const handleDateRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        setPage(0);
    };

    /**
     * 정렬 변경
     */
    const handleSortChange = (field) => {
        if (sortBy === field) {
            // 같은 필드면 방향만 변경
            setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
        } else {
            // 다른 필드면 필드 변경 + DESC로 초기화
            setSortBy(field);
            setSortDirection('DESC');
        }
    };

    /**
     * 필터 초기화
     */
    const resetFilters = () => {
        setKeyword('');
        setRole('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setSortBy('createdAt');
        setSortDirection('DESC');
        setPage(0);
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
        handlePageChange,
        handleSizeChange,

        // 필터링
        keyword,
        role,
        status,
        startDate,
        endDate,
        handleKeywordChange,
        handleRoleChange,
        handleStatusChange,
        handleDateRangeChange,

        // 정렬
        sortBy,
        sortDirection,
        handleSortChange,

        // 기타
        resetFilters,
        refetch: fetchUsers,
    };
};

/**
 * 사용 예시:
 *
 * import { useAdminUserList } from '@/hooks/useAdminUserList';
 *
 * const UserListPage = () => {
 *     const {
 *         users,
 *         loading,
 *         page,
 *         totalPages,
 *         handlePageChange,
 *         handleKeywordChange,
 *         handleRoleChange,
 *         resetFilters,
 *     } = useAdminUserList();
 *
 *     return (
 *         <div>
 *             <input
 *                 value={keyword}
 *                 onChange={(e) => handleKeywordChange(e.target.value)}
 *                 placeholder="검색..."
 *             />
 *             <select onChange={(e) => handleRoleChange(e.target.value)}>
 *                 <option value="">전체</option>
 *                 <option value="INSTRUCTOR">강사</option>
 *                 <option value="STUDENT">학생</option>
 *             </select>
 *             {loading ? (
 *                 <div>Loading...</div>
 *             ) : (
 *                 <table>
 *                     {users.map(user => (
 *                         <tr key={user.userId}>
 *                             <td>{user.name}</td>
 *                             <td>{user.email}</td>
 *                         </tr>
 *                     ))}
 *                 </table>
 *             )}
 *         </div>
 *     );
 * };
 */