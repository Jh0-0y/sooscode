import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDetailHeader from '@/features/admin/components/user/UserDetailHeader.jsx';
import UserInfoCard from '@/features/admin/components/user/UserInfoCard.jsx';
import UserClassCard from '@/features/admin/components/user/UserClassCard.jsx';
import UserActivitySection from '@/features/admin/components/user/UserActivitySection.jsx';
import styles from './AdminUserDetailPage.module.css';

// 더미 데이터
const mockUserDetail = {
    id: 1,
    name: '김철수',
    email: 'kim@example.com',
    role: 'student',
    status: 'active',
    profileImage: null,
    createdAt: '2025-01-15',
    lastLogin: '2025-01-10 14:30:25'
};

const mockUserClasses = [
    { id: 1, title: 'JAVA 기초 강의', instructor: '박지민', progress: 75, enrolledAt: '2025-01-15' },
    { id: 2, title: 'React 심화 과정', instructor: '이수진', progress: 60, enrolledAt: '2025-01-20' },
    { id: 3, title: 'Node.js 백엔드', instructor: '최민호', progress: 45, enrolledAt: '2025-02-01' },
    { id: 4, title: 'Python 데이터 분석', instructor: '정예린', progress: 30, enrolledAt: '2025-02-10' },
];

const mockActivityLogs = [
    {
        id: 1,
        timestamp: '2025-01-10 14:30:25',
        action: 'login',
        ipAddress: '192.168.1.100',
        device: 'Chrome 120 / Windows',
        note: null
    },
    {
        id: 2,
        timestamp: '2025-01-10 14:32:10',
        action: 'class_enter',
        ipAddress: '192.168.1.100',
        device: 'Chrome 120 / Windows',
        note: 'JAVA 기초 강의'
    },
    {
        id: 3,
        timestamp: '2025-01-10 16:45:30',
        action: 'class_exit',
        ipAddress: '192.168.1.100',
        device: 'Chrome 120 / Windows',
        note: 'JAVA 기초 강의'
    },
    {
        id: 4,
        timestamp: '2025-01-10 16:50:00',
        action: 'logout',
        ipAddress: '192.168.1.100',
        device: 'Chrome 120 / Windows',
        note: null
    },
    {
        id: 5,
        timestamp: '2025-01-09 09:15:42',
        action: 'login',
        ipAddress: '192.168.1.105',
        device: 'Safari 17 / macOS',
        note: null
    },
];

const AdminUserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [userClasses, setUserClasses] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // 실제로는 API 호출
        setUserData(mockUserDetail);
        setUserClasses(mockUserClasses);
        setActivityLogs(mockActivityLogs);
        setLoading(false);
    }, [id]);

    const handleBack = () => {
        navigate('/admin/users');
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleUpdateUser = (updatedData) => {
        // 실제로는 API 호출
        setUserData(prev => ({
            ...prev,
            ...updatedData
        }));
        setIsEditing(false);
        alert('사용자 정보가 수정되었습니다.');
    };

    const handleClassClick = (classId) => {
        navigate(`/admin/classes/${classId}`);
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingState}>
                    <p>로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p>사용자를 찾을 수 없습니다</p>
                    <button className={styles.btnPrimary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <UserDetailHeader
                userData={userData}
                onBack={handleBack}
                onEdit={handleEditToggle}
                isEditing={isEditing}
            />

            <div className={styles.contentGrid}>
                <UserInfoCard
                    userData={userData}
                    isEditing={isEditing}
                    onUpdate={handleUpdateUser}
                    onCancel={() => setIsEditing(false)}
                />

                <UserClassCard
                    classes={userClasses}
                    onClassClick={handleClassClick}
                />
            </div>

            <UserActivitySection
                activities={activityLogs}
            />
        </div>
    );
};

export default AdminUserDetailPage;