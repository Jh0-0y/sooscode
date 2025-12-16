import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUserList } from '../../hooks/user/useAdminUserList';
import UserFilter from '../../components/user/UserFilter';
import UserTable from '../../components/user/UserTable';
import Pagination from '../../common/Pagination';
import styles from './AdminUserPage.module.css';

const AdminUserPage = () => {
    const navigate = useNavigate();

    const {
        // 데이터
        users,
        totalPages,
        totalElements,
        loading,

        // 페이지네이션
        page,
        size,
        handlePageChange,

        // 필터링
        keyword,
        role,
        startDate,
        endDate,
        handleKeywordChange,
        handleRoleChange,
        handleDateRangeChange,

        // 정렬
        sortBy,
        sortDirection,
        handleSortChange,

        // 기타
        resetFilters,
        handleExcelDownload,
    } = useAdminUserList();

    const handleUserClick = (user) => {
        navigate(`/admin/users/${user.userId}`);
    };

    return (
        <div className={styles.adminPage}>
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>사용자 관리</h1>
                    <span className={styles.totalCount}>
                        총 {totalElements}명
                    </span>
                </div>
                <div className={styles.headerRight}>
                    <button
                        className={styles.btnExport}
                        onClick={handleExcelDownload}
                        disabled={loading}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        엑셀 다운로드
                    </button>
                </div>
            </div>

            <UserFilter
                keyword={keyword}
                onSearch={handleKeywordChange}
                startDate={startDate}
                endDate={endDate}
                filterRole={role}
                onFilterChange={(filters) => {
                    if (filters.startDate !== undefined || filters.endDate !== undefined) {
                        handleDateRangeChange(filters.startDate || startDate, filters.endDate || endDate);
                    }
                    if (filters.filterRole !== undefined) {
                        handleRoleChange(filters.filterRole === 'all' ? '' : filters.filterRole.toUpperCase());
                    }
                }}
                onSortChange={(field, direction) => {
                    handleSortChange(field);
                }}
                onReset={resetFilters}
            />

            <UserTable
                users={users}
                loading={loading}
                onUserClick={handleUserClick}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                page={page}
                size={size}
            />

            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default AdminUserPage;