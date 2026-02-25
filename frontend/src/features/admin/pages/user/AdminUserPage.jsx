import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUserList } from '../../hooks/user/useAdminUserList';
import UserFilter from '../../components/user/UserFilter';
import UserTable from '../../components/user/UserTable';
import Pagination from '../../common/Pagination';
import UserHeader from "@/features/admin/components/user/UserHeader.jsx";
import UserBulkUploadModal from '../../components/user/UserBulkUploadModal';
import styles from './AdminUserPage.module.css';

const AdminUserPage = () => {
    const navigate = useNavigate();

    // 일괄 등록 모달 상태
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const {
        users,
        totalPages,
        totalElements,
        loading,
        page,
        size,
        handlePageChange,
        keyword,
        role,
        startDate,
        endDate,
        handleKeywordChange,
        handleRoleChange,
        handleDateRangeChange,
        sortBy,
        sortDirection,
        handleSortChange,
        resetFilters,
        handleExcelDownload,
        refetch,
    } = useAdminUserList();

    const handleUserClick = (user) => {
        navigate(`/admin/users/${user.userId}`);
    };

    // 신규 등록
    const handleAddUser = () => {
        navigate('/admin/users/new');
    };

    // 일괄 등록 모달 열기
    const handleBulkUpload = () => {
        setIsBulkModalOpen(true);
    };

    // 일괄 등록 성공 시
    const handleBulkUploadSuccess = () => {
        refetch(); // 목록 새로고침
    };

    return (
        <div className={styles.adminPage}>
            <UserHeader
                onAddUser={handleAddUser}
                onBulkUpload={handleBulkUpload}
                onExcelDownload={handleExcelDownload}
            />

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

            {/* 일괄 등록 모달 */}
            <UserBulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onSuccess={handleBulkUploadSuccess}
            />
        </div>
    );
};

export default AdminUserPage;