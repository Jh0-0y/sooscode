import React from 'react';
import styles from './ClassroomTable.module.css';

/**
 * 클래스 목록 테이블 컴포넌트
 * @param {Array} classes - 클래스 목록 배열
 * @param {Function} onClassClick - 클래스 클릭 핸들러
 */
const ClassroomTable = ({ classes, onClassClick }) => {
    if (!classes || classes.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <p>검색 결과가 없습니다</p>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
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
                {classes.map(cls => (
                    <tr
                        key={cls.classId}
                        className={styles.clickableRow}
                        onClick={() => onClassClick(cls)}
                    >
                        <td>{cls.classId}</td>
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
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClassroomTable;