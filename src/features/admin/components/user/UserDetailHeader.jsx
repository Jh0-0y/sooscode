import React from 'react';
import { useClassExport } from '../../hooks/classroom/useClassExport';
import styles from './ClassroomDetailHeader.module.css';

const ClassroomDetailHeader = ({ classData, onBack }) => {
    const { isExporting, exportClass } = useClassExport();

    const handleExportExcel = () => {
        if (classData?.classId) {
            exportClass(classData.classId, classData.title);
        }
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <button className={styles.btnBack} onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
            </div>
            <div className={styles.headerRight}>
                <button
                    className={styles.btnExport}
                    onClick={handleExportExcel}
                    disabled={isExporting}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    {isExporting ? '다운로드 중...' : '엑셀 다운로드'}
                </button>
            </div>
        </div>
    );
};

export default ClassroomDetailHeader;