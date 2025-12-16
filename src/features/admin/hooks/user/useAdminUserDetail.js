// hooks/useAdminUserDetail.js
import { useState, useEffect, useCallback } from 'react';
import { useAdminUser } from './useAdminUser';

/**
 * 사용자 상세 페이지 전용 훅
 */
export const useAdminUserDetail = (userId) => {
    const {
        loading,
        getUserDetail,
        getUserEnrolledClasses,
        deleteUser,
        activateUser,
        changeUserRole,
    } = useAdminUser();

    const [userData, setUserData] = useState(null);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * 사용자 상세 정보 조회
     */
    const fetchUserDetail = useCallback(async () => {
        if (!userId) {
            setError('사용자 ID가 없습니다.');
            setIsLoading(false);
            return;
        }

        try {
            setError(null);
            setIsLoading(true);

            const response = await getUserDetail(userId);
            console.log('API 응답:', response); // 디버깅용

            // response가 직접 데이터일 수도 있고, response.data일 수도 있음
            const data = response?.data || response;

            if (data) {
                setUserData({
                    userId: data.userId || data.id || userId,
                    name: data.name || '',
                    email: data.email || '',
                    role: (data.role || 'STUDENT').toLowerCase(),
                    status: data.isActive !== false ? 'active' : 'inactive',
                    profileImage: data.profileImage || data.profileUrl || null,
                    createdAt: formatDate(data.createdAt),
                    lastLogin: formatDateTime(data.lastLoginAt || data.lastLogin),
                });
            } else {
                setError('사용자 정보가 없습니다.');
            }
        } catch (err) {
            console.error('사용자 상세 조회 실패:', err);
            setError('사용자 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [userId, getUserDetail]);

    /**
     * 수강 클래스 목록 조회
     */
    const fetchEnrolledClasses = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await getUserEnrolledClasses(userId);
            const data = response?.data || response;

            if (Array.isArray(data)) {
                setEnrolledClasses(data.map(cls => ({
                    id: cls.classId || cls.id,
                    title: cls.title || cls.className || '',
                    instructor: cls.instructorName || cls.instructor || '-',
                    progress: cls.progress || 0,
                    enrolledAt: formatDate(cls.enrolledAt || cls.createdAt),
                })));
            } else {
                setEnrolledClasses([]);
            }
        } catch (err) {
            console.error('수강 클래스 조회 실패:', err);
            setEnrolledClasses([]);
        }
    }, [userId, getUserEnrolledClasses]);

    /**
     * 사용자 비활성화
     */
    const handleDeleteUser = useCallback(async () => {
        if (!userId) return false;

        try {
            const success = await deleteUser(userId);
            if (success) {
                setUserData(prev => prev ? { ...prev, status: 'inactive' } : null);
            }
            return success;
        } catch (err) {
            console.error('사용자 비활성화 실패:', err);
            return false;
        }
    }, [userId, deleteUser]);

    /**
     * 사용자 활성화
     */
    const handleActivateUser = useCallback(async () => {
        if (!userId) return false;

        try {
            const success = await activateUser(userId);
            if (success) {
                setUserData(prev => prev ? { ...prev, status: 'active' } : null);
            }
            return success;
        } catch (err) {
            console.error('사용자 활성화 실패:', err);
            return false;
        }
    }, [userId, activateUser]);

    /**
     * 역할 변경
     */
    const handleChangeRole = useCallback(async (newRole) => {
        if (!userId) return false;

        try {
            const success = await changeUserRole(userId, newRole.toUpperCase());
            if (success) {
                setUserData(prev => prev ? { ...prev, role: newRole.toLowerCase() } : null);
            }
            return success;
        } catch (err) {
            console.error('역할 변경 실패:', err);
            return false;
        }
    }, [userId, changeUserRole]);

    /**
     * 사용자 정보 업데이트
     */
    const handleUpdateUser = useCallback(async (formData) => {
        setUserData(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
        return true;
    }, []);

    const startEditing = useCallback(() => setIsEditing(true), []);
    const cancelEditing = useCallback(() => setIsEditing(false), []);

    const refresh = useCallback(() => {
        fetchUserDetail();
        fetchEnrolledClasses();
    }, [fetchUserDetail, fetchEnrolledClasses]);

    // 초기 데이터 로드
    useEffect(() => {
        fetchUserDetail();
        fetchEnrolledClasses();
    }, [userId]); // userId가 변경될 때만 실행

    return {
        userData,
        enrolledClasses,
        loading: isLoading || loading,
        error,
        isEditing,
        startEditing,
        cancelEditing,
        handleUpdateUser,
        handleDeleteUser,
        handleActivateUser,
        handleChangeRole,
        refresh,
    };
};

// 날짜 포맷 헬퍼
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        return dateString.split('T')[0];
    } catch {
        return dateString;
    }
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
}

export default useAdminUserDetail;