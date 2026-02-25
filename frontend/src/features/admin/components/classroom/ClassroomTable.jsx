import React from 'react';
import styles from './ClassroomTable.module.css';

/**
 * 클래스 목록 테이블 컴포넌트
 * @param {Array} classes - 클래스 목록 배열
 * @param {Function} onClassClick - 클래스 클릭 핸들러
 * @param {boolean} loading - 로딩 상태
 * @param {string} error - 에러 메시지
 * @param {number} currentPage - 현재 페이지 (순번 계산용)
 * @param {number} pageSize - 페이지 크기 (순번 계산용)
 */
const ClassroomTable = ({ classes, onClassClick, loading, error, currentPage = 0, pageSize = 10 }) => {

    // 스켈레톤 행 렌더링
    const renderSkeletonRows = () => {
        return [...Array(pageSize)].map((_, index) => (
            <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '30px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '120px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '50px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '160px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '80px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '60px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '60px' }}></div></div></td>
            </tr>
        ));
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
                {/* 테이블 헤더는 항상 표시 */}
                <thead>
                <tr>
                    <th>번호</th>
                    <th>클래스명</th>
                    <th>강사</th>
                    <th>수강 기간</th>
                    <th>수업 시간</th>
                    <th>수강생</th>
                    <th>유형</th>
                </tr>
                </thead>

                <tbody>
                {/* 에러 상태 */}
                {error ? (
                    <tr>
                        <td colSpan="7" className={styles.messageCell}>
                            <div className={styles.errorState}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <p>{error}</p>
                            </div>
                        </td>
                    </tr>
                ) : loading ? (
                    // 로딩 상태 - 스켈레톤
                    renderSkeletonRows()
                ) : !classes || classes.length === 0 ? (
                    // 빈 상태
                    <tr>
                        <td colSpan="7" className={styles.messageCell}>
                            <div className={styles.emptyState}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                                </svg>
                                <p>검색 결과가 없습니다</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    // 정상 데이터
                    classes.map((cls, index) => {
                        const rowNumber = (currentPage * pageSize) + (index + 1);

                        return (
                            <tr
                                key={cls.classId}
                                className={styles.clickableRow}
                                onClick={() => onClassClick(cls)}
                            >
                                <td>{rowNumber}</td>
                                <td>
                                    <span className={styles.titleCell}>
                                        {cls.title}
                                    </span>
                                </td>
                                <td>{cls.instructorName}</td>
                                <td>
                                    <span className={styles.dateCell}>
                                        {cls.startDate} ~ {cls.endDate}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.dateCell}>
                                        {cls.startTime?.slice(0, 5)} ~ {cls.endTime?.slice(0, 5)}
                                    </span>
                                </td>
                                <td>{cls.studentCount}명</td>
                                <td>
                                    <span className={`${styles.typeBadge} ${cls.online ? styles.online : styles.offline}`}>
                                        {cls.online ? '온라인' : '오프라인'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ClassroomTable;