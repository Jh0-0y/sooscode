import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../common/Pagination.jsx';
import ClassroomHeader from '../../components/classroom/ClassroomHeader';
import ClassroomFilter from '../../components/classroom/ClassroomFilter';
import ClassroomTable from '../../components/classroom/ClassroomTable';
import ClassroomCreateModal from '../../components/classroom/ClassroomCreateModal';
import useClassroomList from '../../hooks/classroom/useClassroomList.js';
import useClassroomCreate from '../../hooks/classroom/useClassroomCreate.js';
import { useToast } from "@/hooks/useToast.js";
import styles from './AdminClassroomPage.module.css';

const AdminClassroomPage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    // ============ 목록 조회 훅 ============
    const {
        classes,
        loading,
        initialLoading,
        error,
        filters,
        pagination,
        handleSearch,
        handleFilterChange,
        handleSortChange,
        handleReset,
        handlePageChange,
        refetch,
        addClassToList
    } = useClassroomList({ pageSize: 10 });

    // ============ 생성 훅 ============
    const {
        isModalOpen,
        openModal,
        closeModal,
        isSubmitting,
        submitError,
        handleSubmit
    } = useClassroomCreate({
        onSuccess: (newClass) => {
            toast.success('클래스가 등록되었습니다.');
            refetch();
        },
        onError: (errorMsg) => {
            toast.error(errorMsg);
        }
    });

    // ============ 클래스 클릭 핸들러 ============
    const handleClassClick = (cls) => {
        navigate(`/admin/classes/${cls.classId}`);
    };

    // ============ 메인 렌더링 ============
    return (
        <div className={styles.adminPage}>
            {/* 헤더 */}
            <ClassroomHeader onAddClass={openModal} />

            {/* 필터 */}
            <ClassroomFilter
                keyword={filters.keyword}
                onSearch={handleSearch}
                startDate={filters.startDate}
                endDate={filters.endDate}
                startTime={filters.startTime}
                endTime={filters.endTime}
                classType={filters.classType}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onReset={handleReset}
            />

            {/* 테이블 - loading과 error를 props로 전달 */}
            <ClassroomTable
                classes={classes}
                onClassClick={handleClassClick}
                loading={loading}
                error={error}
                currentPage={pagination.currentPage}
                pageSize={pagination.pageSize}
            />

            {/* 페이지네이션 */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
            />

            {/* 생성 모달 */}
            <ClassroomCreateModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={submitError}
            />
        </div>
    );
};

export default AdminClassroomPage;