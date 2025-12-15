import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../common/Pagination.jsx';
import ClassroomHeader from '../../components/classroom/ClassroomHeader';
import ClassroomFilter from '../../components/classroom/ClassroomFilter';
import ClassroomTable from '../../components/classroom/ClassroomTable';
import ClassroomCreateModal from '../../components/classroom/ClassroomCreateModal';
import useClassroomList from '../../hooks/classroom/useClassroomList.js';
import useClassroomCreate from '../../hooks/classroom/useClassroomCreate.js';
import {useToast} from "@/hooks/useToast.js";
import styles from './AdminClassroomPage.module.css';

const AdminClassroomPage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const {
        classes,
        loading,
        error,
        keyword,
        startDate,
        endDate,
        onSearch,
        onDateFilterChange,
        onSortChange,
        resetFilters,
        currentPage,
        totalPages,
        onPageChange,
        refetch,
    } = useClassroomList({ pageSize: 10 });

    const {
        isModalOpen,
        openModal,
        closeModal,
        isSubmitting,
        handleSubmit,
    } = useClassroomCreate({
        onSuccess: () => {
            toast.success('클래스가 등록되었습니다.');
            refetch();
        },
        onError: (errorMsg) => {
            toast.error(errorMsg);
        }
    });

    const handleClassClick = (cls) => {
        navigate(`/admin/classes/${cls.classId}`);
    };

    if (loading) {
        return (
            <div className={styles.adminPage}>
                <div className={styles.loadingState}>로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.adminPage}>
                <div className={styles.errorState}>
                    <p>에러: {error}</p>
                    <button className={styles.retryButton} onClick={refetch}>
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminPage}>
            <ClassroomHeader onAddClass={openModal} />

            <ClassroomFilter
                keyword={keyword}
                onSearch={onSearch}
                startDate={startDate}
                endDate={endDate}
                onDateFilterChange={onDateFilterChange}
                onSortChange={onSortChange}
                onReset={resetFilters}
            />

            <ClassroomTable
                classes={classes}
                onClassClick={handleClassClick}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <ClassroomCreateModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default AdminClassroomPage;