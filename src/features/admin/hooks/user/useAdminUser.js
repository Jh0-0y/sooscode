// hooks/useAdminUser.js
import { useState } from 'react';
import { adminUserApi, downloadFile } from '@/api/adminUserApi';
import { useError } from '@/hooks/useError';
import { useToast } from '@/hooks/useToast';

/**
 * 관리자 - 사용자 관리 훅
 */
export const useAdminUser = () => {
    const { handleError } = useError();
    const toast = useToast();

    const [loading, setLoading] = useState(false);

    /**
     * 계정 생성
     */
    const createUser = async (data) => {
        setLoading(true);
        try {
            const response = await adminUserApi.createUser(data);
            toast.success('계정이 생성되었습니다');
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 일괄 계정 생성 (Excel)
     */
    const bulkCreateUsers = async (file) => {
        setLoading(true);
        try {
            const blob = await adminUserApi.bulkCreateUsers(file);
            const filename = `bulk_create_result_${new Date().toISOString().split('T')[0]}.xlsx`;
            downloadFile(blob, filename);
            toast.success('일괄 계정 생성이 완료되었습니다');
            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 목록 조회
     */
    const getUserList = async (params) => {
        setLoading(true);
        try {
            const response = await adminUserApi.getUserList(params);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 상세 조회
     */
    const getUserDetail = async (userId) => {
        setLoading(true);
        try {
            const response = await adminUserApi.getUserDetail(userId);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 히스토리 조회
     */
    const getUserHistory = async (userId, limit = 5) => {
        setLoading(true);
        try {
            const response = await adminUserApi.getUserHistory(userId, limit);
            return response.data;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 삭제 (비활성화)
     */
    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            await adminUserApi.deleteUser(userId);
            toast.success('사용자가 비활성화되었습니다');
            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 활성화
     */
    const activateUser = async (userId) => {
        setLoading(true);
        try {
            await adminUserApi.activateUser(userId);
            toast.success('사용자가 활성화되었습니다');
            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 역할 변경
     */
    const changeUserRole = async (userId, role) => {
        setLoading(true);
        try {
            await adminUserApi.changeUserRole(userId, role);
            toast.success('사용자 역할이 변경되었습니다');
            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 목록 엑셀 다운로드
     */
    const exportUsersToExcel = async (params) => {
        setLoading(true);
        try {
            const blob = await adminUserApi.exportUsersToExcel(params);
            const filename = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
            downloadFile(blob, filename);
            toast.success('엑셀 파일이 다운로드되었습니다');
            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 일괄 생성용 엑셀 템플릿 다운로드
     */
    const downloadExcelTemplate = async () => {
        setLoading(true);
        try {
            const blob = await adminUserApi.downloadExcelTemplate();
            downloadFile(blob, 'user_upload_template.xlsx');
            toast.success('템플릿이 다운로드되었습니다');
            return true;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createUser,
        bulkCreateUsers,
        getUserList,
        getUserDetail,
        getUserHistory,
        deleteUser,
        activateUser,
        changeUserRole,
        exportUsersToExcel,
        downloadExcelTemplate,
    };
};

/**
 * 사용 예시:
 *
 * import { useAdminUser } from '@/hooks/useAdminUser';
 *
 * const MyComponent = () => {
 *     const { loading, getUserList, createUser } = useAdminUser();
 *
 *     // 사용자 목록 조회
 *     const fetchUsers = async () => {
 *         const data = await getUserList({
 *             page: 0,
 *             size: 10,
 *             keyword: 'test',
 *             role: 'INSTRUCTOR'
 *         });
 *         console.log(data);
 *     };
 *
 *     // 계정 생성
 *     const handleCreate = async () => {
 *         await createUser({
 *             email: 'test@example.com',
 *             name: '홍길동',
 *             role: 'INSTRUCTOR'
 *         });
 *     };
 *
 *     return <div>{loading ? 'Loading...' : 'Ready'}</div>;
 * };
 */