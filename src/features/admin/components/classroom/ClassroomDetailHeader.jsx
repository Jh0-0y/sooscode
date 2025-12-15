import React from 'react';
import styles from './ClassroomDetailHeader.module.css';

const ClassroomDetailHeader = ({ classData, onBack }) => {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
                <button className={styles.btnBack} onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h1 className={styles.pageTitle}>{classData.title}</h1>
            </div>
        </div>
    );
};

export default ClassroomDetailHeader;