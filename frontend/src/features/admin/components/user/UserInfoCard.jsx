import React, { useState, useEffect } from 'react';
import { useAdminUserEdit } from '../../hooks/user/useAdminUserEdit';
import styles from './UserInfoCard.module.css';

// 역할 라벨 변환
const getRoleLabel = (role) => {
    const labels = {
        student: '학생',
        instructor: '강사',
        admin: '관리자',
    };
    return labels[role] || role;
};

// 상태 라벨 변환
const getStatusLabel = (status) => {
    const labels = {
        active: '활성',
        inactive: '비활성',
        pending: '대기중',
    };
    return labels[status] || status;
};

const UserInfoCard = ({ userData, onUserUpdated }) => {
    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        role: userData.role,
    });

    // 수정 훅 사용
    const {
        isEditing,
        isSubmitting,
        error,
        startEdit,
        cancelEdit,
        updateUser,
    } = useAdminUserEdit({
        onSuccess: (response) => {
            onUserUpdated?.(response);
        },
    });

    // userData 변경 시 폼 데이터 동기화
    useEffect(() => {
        setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
        });
    }, [userData]);

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUser(userData.userId, formData);
    };

    // 취소 핸들러
    const handleCancel = () => {
        setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
        });
        cancelEdit();
    };

    // 입력 변경 핸들러
    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // 편집 모드 렌더링
    if (isEditing) {
        return (
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>기본 정보 수정</h2>
                </div>
                <div className={styles.cardBody}>
                    {error && (
                        <div className={styles.errorMessage}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} id="editUserForm">
                        <div className={styles.formGroup}>
                            <label htmlFor="name">
                                이름 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange('name')}
                                required
                                className={styles.input}
                                disabled={isSubmitting}
                                placeholder="사용자 이름을 입력하세요"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                이메일 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                                className={styles.input}
                                disabled={isSubmitting}
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role">
                                역할 <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={handleChange('role')}
                                className={styles.select}
                                disabled={isSubmitting}
                            >
                                <option value="student">학생</option>
                                <option value="instructor">강사</option>
                                <option value="admin">관리자</option>
                            </select>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.btnSecondary}
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className={styles.spinner} />
                                        저장 중...
                                    </>
                                ) : '저장'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // 보기 모드 렌더링
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>기본 정보</h2>
                <div className={styles.cardActions}>
                    <button className={styles.btnEdit} onClick={startEdit}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        수정
                    </button>
                </div>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.profileSection}>
                    <div className={styles.profileImageContainer}>
                        {userData.profileImage ? (
                            <img src={userData.profileImage} alt="프로필" className={styles.profileImage} />
                        ) : (
                            <div className={styles.profileImagePlaceholder}>
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className={styles.profileInfo}>
                        <h3 className={styles.userName}>{userData.name}</h3>
                        <p className={styles.userEmail}>{userData.email}</p>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <polyline points="17 11 19 13 23 9"/>
                            </svg>
                        </div>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>역할</span>
                            <span className={`${styles.roleBadge} ${styles[userData.role]}`}>
                                {getRoleLabel(userData.role)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>상태</span>
                            <span className={`${styles.statusBadge} ${styles[userData.status]}`}>
                                {getStatusLabel(userData.status)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>가입일</span>
                            <span className={styles.infoValue}>{userData.createdAt}</span>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            </svg>
                        </div>
                        <div className={styles.infoContent}>
                            <span className={styles.infoLabel}>최근 로그인</span>
                            <span className={styles.infoValue}>{userData.lastLogin}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;