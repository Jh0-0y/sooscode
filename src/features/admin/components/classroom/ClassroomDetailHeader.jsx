import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassExport } from '../../hooks/classroom/useClassExport';
import styles from './ClassroomDetailHeader.module.css';

/**
 * 클래스 상세 페이지 헤더 컴포넌트
 * @param {Object} classData - 클래스 데이터
 * @param {number} classData.classId - 클래스 ID
 * @param {string} classData.title - 클래스 제목
 */
const ClassroomDetailHeader = ({ classData }) => {
    const navigate = useNavigate();
    const { isExporting, exportClass } = useClassExport();

    const handleBack = () => {
        navigate('/admin/classes');
    };

    const handleExcelDownload = () => {
        if (classData?.classId) {
            exportClass(classData.classId, classData.title);
        }
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
            <div className={styles.headerActions}>
                <button
                    className={styles.btnSecondary}
                    onClick={handleExcelDownload}
                    disabled={isExporting}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    {isExporting ? '다운로드 중...' : '엑셀 다운로드'}
                </button>
            </div>
        </div>
    );
};

export default ClassroomDetailHeader;