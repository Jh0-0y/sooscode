import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserDetailHeader.module.css';

const UserDetailHeader = ({ userName }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/admin/users');
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
                <button className={styles.btnBack} onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h1 className={styles.pageTitle}>{userName || '사용자 상세'}</h1>
            </div>
        </div>
    );
};

export default UserDetailHeader;