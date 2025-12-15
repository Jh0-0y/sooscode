import React from 'react';
import styles from './UserHeader.module.css';

const UserHeader = ({ onAddUser, onBulkUpload, onExcelDownload }) => {
    return (
        <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
                <h1 className={styles.pageTitle}>사용자 관리</h1>
            </div>
            <div className={styles.headerActions}>
                <button className={styles.btnSecondary} onClick={onBulkUpload}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    엑셀 일괄 등록
                </button>
                <button className={styles.btnSecondary} onClick={onExcelDownload}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    엑셀 다운로드
                </button>
                <button className={styles.btnPrimary} onClick={onAddUser}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    신규 등록
                </button>
            </div>
        </div>
    );
};

export default UserHeader;