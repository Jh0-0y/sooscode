import React from 'react';
import { useClassExport } from '../../hooks/classroom/useClassExport';
import styles from './ClassroomHeader.module.css';

/**
 * 클래스 목록 페이지 헤더 컴포넌트
 * @param {Function} onAddClass - 클래스 추가 버튼 클릭 핸들러
 * @param {Object} filters - 현재 적용된 필터 (엑셀 다운로드 시 사용)
 */
const ClassroomHeader = ({ onAddClass, filters }) => {
    const { isExporting, exportClassList } = useClassExport();

    const handleExcelDownload = () => {
        exportClassList(filters);
    };

    return (
        <div className={styles.pageHeader}>
            <div className={styles.headerLeft}>
                <h1 className={styles.pageTitle}>클래스 관리</h1>
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
                <button className={styles.btnPrimary} onClick={onAddClass}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    신규 등록
                </button>
            </div>
        </div>
    );
};

export default ClassroomHeader;