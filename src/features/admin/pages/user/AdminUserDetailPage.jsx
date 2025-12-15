import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import commonStyles from '../CommonAdmin.module.css';
import styles from './AdminUserDetailPage.module.css';

// 더미 데이터 (실제로는 API에서 가져옴)
const mockUsers = [
    { id: 1, name: '김철수', email: 'kim@example.com', role: 'student', status: 'active', classes: ['React 기초반', 'Spring Boot 입문'], createdAt: '2024-01-15', lastLogin: '2024-12-13 14:30' },
    { id: 2, name: '이영희', email: 'lee@example.com', role: 'student', status: 'active', classes: ['Python 중급'], createdAt: '2024-02-20', lastLogin: '2024-12-12 09:15' },
    { id: 3, name: '박지민', email: 'park@example.com', role: 'instructor', status: 'active', classes: ['React 기초반'], createdAt: '2024-01-10', lastLogin: '2024-12-13 16:45' },
    { id: 4, name: '최수진', email: 'choi@example.com', role: 'student', status: 'inactive', classes: [], createdAt: '2024-03-05', lastLogin: '2024-11-28 11:20' },
    { id: 5, name: '정민호', email: 'jung@example.com', role: 'student', status: 'active', classes: ['Spring Boot 입문', 'Python 중급'], createdAt: '2024-02-28', lastLogin: '2024-12-13 10:00' },
];

const mockLoginLogs = [
    { id: 1, userId: 1, action: 'login', timestamp: '2024-12-13 14:30:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { id: 2, userId: 1, action: 'logout', timestamp: '2024-12-13 12:00:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { id: 3, userId: 1, action: 'login', timestamp: '2024-12-13 09:00:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { id: 4, userId: 1, action: 'logout', timestamp: '2024-12-12 18:30:00', ip: '192.168.1.105', device: 'Safari / macOS' },
    { id: 5, userId: 1, action: 'login', timestamp: '2024-12-12 14:00:00', ip: '192.168.1.105', device: 'Safari / macOS' },
    { id: 6, userId: 1, action: 'logout', timestamp: '2024-12-11 17:00:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { id: 7, userId: 1, action: 'login', timestamp: '2024-12-11 09:30:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { id: 8, userId: 1, action: 'login', timestamp: '2024-12-10 10:00:00', ip: '192.168.1.102', device: 'Mobile / iOS' },
];

// 클래스 더미 데이터 (실제로는 API에서 가져옴)
const mockClassData = {
    'React 기초반': { id: 1, progress: 75 },
    'Spring Boot 입문': { id: 2, progress: 60 },
    'Python 중급': { id: 3, progress: 45 },
};

const LOGS_PER_PAGE = 5;

const AdminUserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loginLogs, setLoginLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logPage, setLogPage] = useState(0);

    // 사용자 데이터 로드
    useEffect(() => {
        // 실제로는 API 호출
        const foundUser = mockUsers.find(u => u.id === parseInt(id));
        if (foundUser) {
            setUserData(foundUser);
            setLoginLogs(mockLoginLogs.filter(log => log.userId === parseInt(id)));
        }
        setLoading(false);
    }, [id]);

    // 페이지네이션 적용된 로그인 기록
    const paginatedLogs = useMemo(() => {
        const startIndex = logPage * LOGS_PER_PAGE;
        return loginLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);
    }, [loginLogs, logPage]);

    const totalLogPages = Math.ceil(loginLogs.length / LOGS_PER_PAGE);

    // 목록으로 돌아가기
    const handleBack = () => {
        navigate('/admin/users');
    };

    // 사용자 수정 페이지로 이동
    const handleEditUser = () => {
        navigate(`/admin/users/${id}/edit`);
    };

    // 클래스 상세로 이동
    const handleClassClick = (className) => {
        const classInfo = mockClassData[className];
        if (classInfo) {
            navigate(`/admin/classrooms/${classInfo.id}`);
        }
    };

    // 역할 라벨
    const getRoleLabel = (role) => {
        const labels = { student: '학생', instructor: '강사', admin: '관리자' };
        return labels[role] || role;
    };

    // 상태 라벨
    const getStatusLabel = (status) => {
        const labels = { active: '활성', inactive: '비활성' };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className={commonStyles.adminPage}>
                <div className={commonStyles.loadingState}>
                    <p>로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={commonStyles.adminPage}>
                <div className={commonStyles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p>사용자를 찾을 수 없습니다</p>
                    <button className={commonStyles.btnPrimary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={commonStyles.adminPage}>
            {/* 헤더 */}
            <div className={commonStyles.pageHeader}>
                <div className={commonStyles.headerLeft}>
                    <button className={commonStyles.btnBack} onClick={handleBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h1 className={commonStyles.pageTitle}>{userData.name}</h1>
                    <span className={`${commonStyles.roleBadge} ${commonStyles[userData.role]}`}>
                        {getRoleLabel(userData.role)}
                    </span>
                    <span className={`${commonStyles.statusBadge} ${commonStyles[userData.status]}`}>
                        {getStatusLabel(userData.status)}
                    </span>
                </div>
                <div className={commonStyles.headerActions}>
                    <button className={commonStyles.btnSecondary} onClick={handleEditUser}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        정보 수정
                    </button>
                </div>
            </div>

            {/* 정보 그리드 */}
            <div className={styles.detailGrid}>
                {/* 기본 정보 카드 */}
                <div className={styles.infoCard}>
                    <h2 className={styles.sectionTitle}>기본 정보</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>이름</span>
                            <span className={styles.infoValue}>{userData.name}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>이메일</span>
                            <span className={styles.infoValue}>{userData.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>가입일</span>
                            <span className={styles.infoValue}>{userData.createdAt}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>최근 로그인</span>
                            <span className={styles.infoValue}>{userData.lastLogin}</span>
                        </div>
                    </div>
                </div>

                {/* 수강 클래스 카드 */}
                <div className={styles.infoCard}>
                    <h2 className={styles.sectionTitle}>
                        수강 클래스
                        <span className={styles.countBadge}>{userData.classes.length}개</span>
                    </h2>
                    {userData.classes.length > 0 ? (
                        <ul className={styles.classList}>
                            {userData.classes.map((className, idx) => {
                                const classInfo = mockClassData[className];
                                return (
                                    <li
                                        key={idx}
                                        className={styles.classListItem}
                                        onClick={() => handleClassClick(className)}
                                    >
                                        <div className={styles.classInfo}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                                            </svg>
                                            <span className={styles.className}>{className}</span>
                                        </div>
                                        <div className={styles.classProgress}>
                                            {classInfo && (
                                                <>
                                                    <div className={styles.progressBar}>
                                                        <div
                                                            className={styles.progressFill}
                                                            style={{ width: `${classInfo.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className={styles.progressText}>{classInfo.progress}%</span>
                                                </>
                                            )}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 18l6-6-6-6"/>
                                            </svg>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className={`${commonStyles.emptyState} ${commonStyles.small}`}>
                            <p>수강 중인 클래스가 없습니다</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 로그인 기록 섹션 */}
            <div className={styles.logSection}>
                <h2 className={styles.sectionTitle}>
                    로그인 기록
                    <span className={styles.countBadge}>{loginLogs.length}건</span>
                </h2>

                {loginLogs.length > 0 ? (
                    <>
                        <div className={commonStyles.tableContainer}>
                            <table className={`${commonStyles.dataTable} ${commonStyles.compact}`}>
                                <thead>
                                <tr>
                                    <th>일시</th>
                                    <th>활동</th>
                                    <th>IP 주소</th>
                                    <th>기기</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedLogs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.timestamp}</td>
                                        <td>
                                            <span className={`${styles.logAction} ${styles[log.action]}`}>
                                                {log.action === 'login' ? '로그인' : '로그아웃'}
                                            </span>
                                        </td>
                                        <td className={styles.ipAddress}>{log.ip}</td>
                                        <td>{log.device || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={logPage}
                            totalPages={totalLogPages}
                            onPageChange={setLogPage}
                        />
                    </>
                ) : (
                    <div className={`${commonStyles.emptyState} ${commonStyles.small}`}>
                        <p>로그인 기록이 없습니다</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserDetailPage;