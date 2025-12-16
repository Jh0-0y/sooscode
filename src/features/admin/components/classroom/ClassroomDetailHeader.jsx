import React from 'react';
import styles from './ClassroomDetailHeader.module.css';
import {useNavigate} from "react-router-dom";

/**
 * 클래스 상세 페이지 헤더 컴포넌트
 * @param {Object} classData - 클래스 데이터
 */
const ClassroomDetailHeader = ({ classData }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/admin/classes');
    };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
                <button className={styles.btnBack} onClick={handleBack}>
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