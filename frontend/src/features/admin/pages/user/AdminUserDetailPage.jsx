import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAdminUserDetail from '../../hooks/user/useAdminUserDetail';
import styles from './AdminUserDetailPage.module.css';
import UserDetailHeader from "@/features/admin/components/user/UserDetailHeader.jsx";
import UserInfoCard from "@/features/admin/components/user/UserInfoCard.jsx";
import UserClassCard from "@/features/admin/components/user/UserClassCard.jsx";

const AdminUserDetailPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    // URL 파라미터 이름 확인 (userId 또는 id)
    const userId = params.userId || params.id;

    console.log('URL params:', params); // 디버깅용
    console.log('userId:', userId); // 디버깅용

    const {
        userData,
        enrolledClasses,
        loading,
        error,
        isEditing,
        startEditing,
        cancelEditing,
        handleUpdateUser,
        handleDeleteUser,
        handleActivateUser,
    } = useAdminUserDetail(userId);

    const handleBack = () => {
        navigate('/admin/users');
    };

    const handleClassClick = (classId) => {
        navigate(`/admin/classes/${classId}`);
    };

    const handleToggleStatus = async () => {
        if (!userData) return;

        if (userData.status === 'active') {
            if (window.confirm('이 사용자를 비활성화하시겠습니까?')) {
                await handleDeleteUser();
            }
        } else {
            if (window.confirm('이 사용자를 활성화하시겠습니까?')) {
                await handleActivateUser();
            }
        }
    };

    // 로딩 상태
    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner} />
                    <p>로딩 중...</p>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p>{error}</p>
                    <button className={styles.btnPrimary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // 데이터 없음
    if (!userData) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <p>사용자를 찾을 수 없습니다</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>userId: {userId}</p>
                    <button className={styles.btnPrimary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* 헤더 */}
            <UserDetailHeader />

            {/* 컨텐츠 */}
            <div className={styles.contentGrid}>
                <div className={styles.mainColumn}>
                    <UserInfoCard
                        userData={userData}
                        isEditing={isEditing}
                        onUpdate={handleUpdateUser}
                        onCancel={cancelEditing}
                    />
                </div>

                <div className={styles.sideColumn}>
                    <UserClassCard
                        classes={enrolledClasses}
                        onClassClick={handleClassClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetailPage;