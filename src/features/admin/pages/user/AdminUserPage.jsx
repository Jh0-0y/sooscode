import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import commonStyles from '../CommonAdmin.module.css';

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
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({ name: '', email: '', role: 'student', status: 'active' });
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

    // 신규 사용자 등록 폼 열기
    const handleAddUser = () => {
        setFormMode('create');
        setFormData({ name: '', email: '', role: 'student', status: 'active' });
        setViewMode('form');
    };

    // 사용자 수정 폼 열기
    const handleEditUser = (user, e) => {
        e.stopPropagation();
        setFormMode('edit');
        setFormData({ ...user });
        setViewMode('form');
    };

    // 폼 제출
    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (formMode === 'create') {
            const newUser = {
                ...formData,
                id: Math.max(...users.map(u => u.id)) + 1,
                classes: [],
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: '-'
            };
            setUsers([...users, newUser]);
        } else {
            setUsers(users.map(u => u.id === formData.id ? { ...u, ...formData } : u));
        }
        setViewMode('list');
    };

    // 목록으로 돌아가기
    const handleBack = () => {
        setViewMode('list');
    };

    // 엑셀 다운로드 (시뮬레이션)
    const handleExcelDownload = () => {
        alert('사용자 목록을 엑셀 파일로 다운로드합니다.');
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

    return (
        <div className={commonStyles.adminPage}>
            {/* 헤더 */}
            <div className={commonStyles.pageHeader}>
                <div className={commonStyles.headerLeft}>
                    {viewMode === 'form' && (
                        <button className={commonStyles.btnBack} onClick={handleBack}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    )}
                    <h1 className={commonStyles.pageTitle}>
                        {viewMode === 'list' && '사용자 관리'}
                        {viewMode === 'form' && (formMode === 'create' ? '신규 사용자 등록' : '사용자 정보 수정')}
                    </h1>
                </div>
                {viewMode === 'list' && (
                    <div className={commonStyles.headerActions}>
                        <button className={commonStyles.btnSecondary} onClick={() => setShowBulkUpload(true)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            엑셀 일괄 등록
                        </button>
                        <button className={commonStyles.btnSecondary} onClick={handleExcelDownload}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                            </svg>
                            엑셀 다운로드
                        </button>
                        <button className={commonStyles.btnPrimary} onClick={handleAddUser}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            신규 등록
                        </button>
                    </div>
                )}
            </div>

            {/* 사용자 목록 뷰 */}
            {viewMode === 'list' && (
                <>
                    {/* 검색 및 필터 */}
                    <div className={commonStyles.filterSection}>
                        <div className={commonStyles.searchBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="이름 또는 이메일로 검색..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div className={commonStyles.filterGroup}>
                            <select value={filterRole} onChange={(e) => handleFilterRoleChange(e.target.value)}>
                                <option value="all">모든 역할</option>
                                <option value="student">학생</option>
                                <option value="instructor">강사</option>
                                <option value="admin">관리자</option>
                            </select>
                            <select value={filterStatus} onChange={(e) => handleFilterStatusChange(e.target.value)}>
                                <option value="all">모든 상태</option>
                                <option value="active">활성</option>
                                <option value="inactive">비활성</option>
                            </select>
                        </div>
                    </div>

                    {/* 사용자 테이블 */}
                    {paginatedUsers.length > 0 ? (
                        <>
                            <div className={commonStyles.tableContainer}>
                                <table className={commonStyles.dataTable}>
                                    <thead>
                                    <tr>
                                        <th>이름</th>
                                        <th>이메일</th>
                                        <th>역할</th>
                                        <th>상태</th>
                                        <th>수강 클래스</th>
                                        <th>가입일</th>
                                        <th>최근 로그인</th>
                                        <th>관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginatedUsers.map(user => (
                                        <tr
                                            key={user.id}
                                            onClick={() => handleUserClick(user)}
                                            className={commonStyles.clickableRow}
                                        >
                                            <td>
                                                <span className={`${commonStyles.userName} ${commonStyles.clickable}`}>
                                                    {user.name}
                                                </span>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`${commonStyles.roleBadge} ${commonStyles[user.role]}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${commonStyles.statusBadge} ${commonStyles[user.status]}`}>
                                                    {getStatusLabel(user.status)}
                                                </span>
                                            </td>
                                            <td>{user.classes.length}개</td>
                                            <td>{user.createdAt}</td>
                                            <td>{user.lastLogin}</td>
                                            <td>
                                                <button
                                                    className={commonStyles.btnIcon}
                                                    onClick={(e) => handleEditUser(user, e)}
                                                    title="수정"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                currentPage={userPage}
                                totalPages={totalUserPages}
                                onPageChange={setUserPage}
                            />
                        </>
                    ) : (
                        <div className={commonStyles.emptyState}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <p>검색 결과가 없습니다</p>
                        </div>
                    )}
                </>
            )}

            {/* 사용자 등록/수정 폼 */}
            {viewMode === 'form' && (
                <div className={commonStyles.formView}>
                    <form className={commonStyles.adminForm} onSubmit={handleSubmitForm}>
                        <div className={commonStyles.formGroup}>
                            <label htmlFor="name">이름 <span className="required">*</span></label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="사용자 이름을 입력하세요"
                                required
                            />
                        </div>
                        <div className={commonStyles.formGroup}>
                            <label htmlFor="email">이메일 <span className="required">*</span></label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="이메일 주소를 입력하세요"
                                required
                            />
                        </div>
                        <div className={commonStyles.formRow}>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="role">역할 <span className="required">*</span></label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">학생</option>
                                    <option value="instructor">강사</option>
                                    <option value="admin">관리자</option>
                                </select>
                            </div>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="status">상태 <span className="required">*</span></label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">활성</option>
                                    <option value="inactive">비활성</option>
                                </select>
                            </div>
                        </div>
                        <div className={commonStyles.formActions}>
                            <button type="button" className={commonStyles.btnSecondary} onClick={handleBack}>취소</button>
                            <button type="submit" className={commonStyles.btnPrimary}>
                                {formMode === 'create' ? '등록하기' : '저장하기'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 엑셀 일괄 업로드 모달 */}
            {showBulkUpload && (
                <div className={commonStyles.modalOverlay} onClick={() => setShowBulkUpload(false)}>
                    <div className={commonStyles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={commonStyles.modalHeader}>
                            <h2>엑셀 일괄 등록</h2>
                            <button className={commonStyles.btnClose} onClick={() => setShowBulkUpload(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className={commonStyles.modalBody}>
                            <div className={commonStyles.uploadZone}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                </svg>
                                <p>엑셀 파일을 드래그하거나 클릭하여 업로드</p>
                                <span className={commonStyles.uploadHint}>.xlsx, .xls 파일만 지원</span>
                                <input type="file" accept=".xlsx,.xls" />
                            </div>
                            <div className={commonStyles.templateDownload}>
                                <button className={commonStyles.btnLink}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                                    </svg>
                                    샘플 양식 다운로드
                                </button>
                            </div>
                        </div>
                        <div className={commonStyles.modalFooter}>
                            <button className={commonStyles.btnSecondary} onClick={() => setShowBulkUpload(false)}>취소</button>
                            <button className={commonStyles.btnPrimary}>업로드</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserPage;