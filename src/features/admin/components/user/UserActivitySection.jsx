import React from 'react';
import styles from './UserActivitySection.module.css';

const UserActivitySection = ({ activities }) => {
    const getActivityLabel = (action) => {
        const labels = {
            login: '로그인',
            logout: '로그아웃',
            class_enter: '클래스 입장',
            class_exit: '클래스 퇴장'
        };
        return labels[action] || action;
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case 'login':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                    </svg>
                );
            case 'logout':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                );
            case 'class_enter':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                );
            case 'class_exit':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>활동 기록</h2>
                <span className={styles.activityCount}>총 {activities.length}건</span>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>일시</th>
                        <th>활동</th>
                        <th>IP 주소</th>
                        <th>기기</th>
                        <th>비고</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activities.map(activity => (
                        <tr key={activity.id}>
                            <td>{activity.timestamp}</td>
                            <td>
                                    <span className={`${styles.activityBadge} ${styles[activity.action]}`}>
                                        {getActivityIcon(activity.action)}
                                        {getActivityLabel(activity.action)}
                                    </span>
                            </td>
                            <td>
                                <span className={styles.ipAddress}>{activity.ipAddress}</span>
                            </td>
                            <td>{activity.device}</td>
                            <td>
                                {activity.note && (
                                    <span className={styles.noteText}>{activity.note}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserActivitySection;