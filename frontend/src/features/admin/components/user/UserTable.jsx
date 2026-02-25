import React from 'react';
import styles from './UserTable.module.css';

/**
 * 사용자 목록 테이블 컴포넌트
 * @param {Array} users - 사용자 목록 배열
 * @param {boolean} loading - 로딩 상태
 * @param {Function} onUserClick - 사용자 클릭 핸들러
 * @param {string} sortBy - 정렬 기준 필드
 * @param {string} sortDirection - 정렬 방향 (ASC/DESC)
 * @param {Function} onSortChange - 정렬 변경 핸들러
 * @param {number} page - 현재 페이지 (순번 계산용)
 * @param {number} size - 페이지 크기 (순번 계산용)
 * @param {string} error - 에러 메시지
 */
const UserTable = ({
                       users,
                       loading,
                       onUserClick,
                       sortBy,
                       sortDirection,
                       onSortChange,
                       page = 0,
                       size = 10,
                       error
                   }) => {

    const getRoleLabel = (role) => {
        const labels = {
            STUDENT: '학생',
            INSTRUCTOR: '강사',
            ADMIN: '관리자',
            student: '학생',
            instructor: '강사',
            admin: '관리자'
        };
        return labels[role] || role;
    };

    const getRoleClass = (role) => {
        const roleMap = {
            STUDENT: 'student',
            INSTRUCTOR: 'instructor',
            ADMIN: 'admin',
            student: 'student',
            instructor: 'instructor',
            admin: 'admin'
        };
        return roleMap[role] || 'student';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dateString.split('T')[0];
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 순번 계산
    const getRowNumber = (index) => {
        return page * size + index + 1;
    };

    const renderSortIcon = (field) => {
        if (sortBy !== field) {
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sortIcon}>
                    <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
                </svg>
            );
        }
        return sortDirection === 'ASC' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sortIconActive}>
                <path d="M7 15l5 5 5-5"/>
            </svg>
        ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sortIconActive}>
                <path d="M7 9l5-5 5 5"/>
            </svg>
        );
    };

    // 스켈레톤 행 렌더링
    const renderSkeletonRows = () => {
        return [...Array(size)].map((_, index) => (
            <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '30px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '80px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '180px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '60px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '50px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '100px' }}></div></div></td>
                <td><div className={styles.skeletonWrapper}><div className={styles.skeleton} style={{ width: '140px' }}></div></div></td>
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
                    <th
                        className={styles.sortableHeader}
                        onClick={() => onSortChange?.('name')}
                    >
                        이름 {renderSortIcon('name')}
                    </th>
                    <th
                        className={styles.sortableHeader}
                        onClick={() => onSortChange?.('email')}
                    >
                        이메일 {renderSortIcon('email')}
                    </th>
                    <th>역할</th>
                    <th>수강 클래스</th>
                    <th
                        className={styles.sortableHeader}
                        onClick={() => onSortChange?.('createdAt')}
                    >
                        가입일 {renderSortIcon('createdAt')}
                    </th>
                    <th>최근 로그인</th>
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
                ) : !users || users.length === 0 ? (
                    // 빈 상태
                    <tr>
                        <td colSpan="7" className={styles.messageCell}>
                            <div className={styles.emptyState}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                <p>검색 결과가 없습니다</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    // 정상 데이터
                    users.map((user, index) => (
                        <tr
                            key={user.userId || user.id}
                            onClick={() => onUserClick(user)}
                            className={styles.clickableRow}
                        >
                            <td>{getRowNumber(index)}</td>
                            <td>
                                <span className={styles.userName}>
                                    {user.name}
                                </span>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`${styles.roleBadge} ${styles[getRoleClass(user.role)]}`}>
                                    {getRoleLabel(user.role)}
                                </span>
                            </td>
                            <td>{user.classCount ?? user.classes?.length ?? 0}개</td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>{formatDateTime(user.lastLoginAt || user.lastLogin)}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;