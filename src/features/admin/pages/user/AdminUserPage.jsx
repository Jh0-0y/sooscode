import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../common/Pagination.jsx';
import UserHeader from '../../components/user/UserHeader.jsx';
import UserFilter from '../../components/user/UserFilter.jsx';
import UserTable from '../../components/user/UserTable.jsx';
import UserCreateModal from '../../components/user/UserCreateModal.jsx';
import UserBulkUploadModal from '../../components/user/UserBulkUploadModal.jsx';
import styles from './AdminUserPage.module.css';

// 더미 데이터 (실제로는 API에서 가져옴)
const mockUsers = [
    { id: 1, name: '김철수', email: 'kim@example.com', role: 'student', status: 'active', classes: ['React 기초반', 'Spring Boot 입문'], createdAt: '2024-01-15', lastLogin: '2024-12-13 14:30' },
    { id: 2, name: '이영희', email: 'lee@example.com', role: 'student', status: 'active', classes: ['Python 중급'], createdAt: '2024-02-20', lastLogin: '2024-12-12 09:15' },
    { id: 3, name: '박지민', email: 'park@example.com', role: 'instructor', status: 'active', classes: ['React 기초반'], createdAt: '2024-01-10', lastLogin: '2024-12-13 16:45' },
    { id: 4, name: '최수진', email: 'choi@example.com', role: 'student', status: 'inactive', classes: [], createdAt: '2024-03-05', lastLogin: '2024-11-28 11:20' },
    { id: 5, name: '정민호', email: 'jung@example.com', role: 'student', status: 'active', classes: ['Spring Boot 입문', 'Python 중급'], createdAt: '2024-02-28', lastLogin: '2024-12-13 10:00' },
    { id: 6, name: '강예진', email: 'kang@example.com', role: 'student', status: 'active', classes: ['React 기초반'], createdAt: '2024-03-10', lastLogin: '2024-12-13 11:30' },
    { id: 7, name: '윤도현', email: 'yoon@example.com', role: 'instructor', status: 'active', classes: ['Python 중급'], createdAt: '2024-01-20', lastLogin: '2024-12-12 15:00' },
    { id: 8, name: '한소희', email: 'han@example.com', role: 'student', status: 'inactive', classes: [], createdAt: '2024-04-01', lastLogin: '2024-10-15 09:00' },
];

const USERS_PER_PAGE = 10;

const AdminUserPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [userPage, setUserPage] = useState(0);

    // 필터링된 사용자 목록
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'all' || user.role === filterRole;
            const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, filterRole, filterStatus]);

    // 페이지네이션 적용된 사용자 목록
    const paginatedUsers = useMemo(() => {
        const startIndex = userPage * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, userPage]);

    const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    // 필터 변경 시 페이지 초기화
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setUserPage(0);
    };

    const handleFilterRoleChange = (value) => {
        setFilterRole(value);
        setUserPage(0);
    };

    const handleFilterStatusChange = (value) => {
        setFilterStatus(value);
        setUserPage(0);
    };

    // 사용자 상세 페이지로 이동
    const handleUserClick = (user) => {
        navigate(`/admin/users/${user.id}`);
    };

    // 신규 사용자 등록
    const handleCreateUser = (formData) => {
        const newUser = {
            ...formData,
            id: Math.max(...users.map(u => u.id)) + 1,
            classes: [],
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: '-'
        };
        setUsers([...users, newUser]);
        setShowCreateModal(false);
    };

    // 엑셀 일괄 업로드
    const handleBulkUpload = (file) => {
        // 실제로는 파일을 파싱하여 사용자 추가
        alert(`${file.name} 파일이 업로드되었습니다.`);
        setShowBulkUpload(false);
    };

    // 엑셀 다운로드
    const handleExcelDownload = () => {
        alert('사용자 목록을 엑셀 파일로 다운로드합니다.');
    };

    return (
        <div className={styles.adminPage}>
            <UserHeader
                onAddUser={() => setShowCreateModal(true)}
                onBulkUpload={() => setShowBulkUpload(true)}
                onExcelDownload={handleExcelDownload}
            />

            <UserFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterRole={filterRole}
                onFilterRoleChange={handleFilterRoleChange}
                filterStatus={filterStatus}
                onFilterStatusChange={handleFilterStatusChange}
            />

            <UserTable users={paginatedUsers} onUserClick={handleUserClick} />

            {paginatedUsers.length > 0 && (
                <Pagination
                    currentPage={userPage}
                    totalPages={totalUserPages}
                    onPageChange={setUserPage}
                />
            )}

            <UserCreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateUser}
            />

            <UserBulkUploadModal
                isOpen={showBulkUpload}
                onClose={() => setShowBulkUpload(false)}
                onSubmit={handleBulkUpload}
            />
        </div>
    );
};

export default AdminUserPage;