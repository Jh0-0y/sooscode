import React from 'react';
import styles from './UserTable.module.css';

const UserTable = ({ users, onUserClick }) => {
    const getRoleLabel = (role) => {
        const labels = { student: '학생', instructor: '강사', admin: '관리자' };
        return labels[role] || role;
    };

    const getStatusLabel = (status) => {
        const labels = { active: '활성', inactive: '비활성' };
        return labels[status] || status;
    };

    if (users.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
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
                    <th>이름</th>
                    <th>이메일</th>
                    <th>역할</th>
                    <th>수강 클래스</th>
                    <th>가입일</th>
                    <th>최근 로그인</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr
                        key={user.id}
                        onClick={() => onUserClick(user)}
                        className={styles.clickableRow}
                    >
                        <td>{user.id}</td>
                        <td>
                            <span className={styles.userName}>
                                {user.name}
                            </span>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                {getRoleLabel(user.role)}
                            </span>
                        </td>
                        <td>{user.classes.length}개</td>
                        <td>{user.createdAt}</td>
                        <td>{user.lastLogin}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;