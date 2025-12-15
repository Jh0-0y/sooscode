import React from 'react';
import styles from './UserDetailHeader.module.css';

const UserDetailHeader = ({ userData, onBack, onEdit, isEditing }) => {
    return (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <button className={styles.btnBack} onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div>
                    <h1 className={styles.pageTitle}>사용자 상세</h1>
                    <p className={styles.userEmail}>{userData.email}</p>
                </div>
            </div>
            <div className={styles.headerActions}>
                <button
                    className={isEditing ? styles.btnSecondary : styles.btnPrimary}
                    onClick={onEdit}
                >
                    {isEditing ? (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                            편집 취소
                        </>
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            정보 수정
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserDetailHeader;