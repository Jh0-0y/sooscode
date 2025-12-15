import React, { useState, useEffect } from 'react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = ({ userData, isEditing, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        profileImage: userData.profileImage
    });

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                profileImage: userData.profileImage
            });
        }
    }, [isEditing, userData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getRoleLabel = (role) => {
        const labels = { student: '학생', instructor: '강사', admin: '관리자' };
        return labels[role] || role;
    };

    const getStatusLabel = (status) => {
        const labels = { active: '활성', inactive: '비활성' };
        return labels[status] || status;
    };

    if (isEditing) {
        return (
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>기본 정보 수정</h2>
                </div>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSubmit} id="editUserForm">
                        <div className={styles.profileImageSection}>
                            <div className={styles.profileImageWrapper}>
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="프로필" className={styles.profileImage} />
                                ) : (
                                    <div className={styles.profileImagePlaceholder}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label className={styles.imageUploadBtn}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                이미지 변경
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="name">이름 <span className={styles.required}>*</span></label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">이메일 <span className={styles.required}>*</span></label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role">역할 <span className={styles.required}>*</span></label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student">학생</option>
                                <option value="instructor">강사</option>
                                <option value="admin">관리자</option>
                            </select>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                                취소
                            </button>
                            <button type="submit" className={styles.btnPrimary}>
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>기본 정보</h2>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.profileSection}>
                    {userData.profileImage ? (
                        <img src={userData.profileImage} alt="프로필" className={styles.profileImage} />
                    ) : (
                        <div className={styles.profileImagePlaceholder}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                    )}
                </div>

                <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>이름</span>
                        <span className={styles.infoValue}>{userData.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>이메일</span>
                        <span className={styles.infoValue}>{userData.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>역할</span>
                        <span className={`${styles.roleBadge} ${styles[userData.role]}`}>
                            {getRoleLabel(userData.role)}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>상태</span>
                        <span className={`${styles.statusBadge} ${styles[userData.status]}`}>
                            {getStatusLabel(userData.status)}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>가입일</span>
                        <span className={styles.infoValue}>{userData.createdAt}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>최근 로그인</span>
                        <span className={styles.infoValue}>{userData.lastLogin}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;