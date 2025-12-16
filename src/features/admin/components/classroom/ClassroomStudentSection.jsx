import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClassroomStudentsList from '../../hooks/classroom/useClassroomStudentsList.js';
import useClassroomStudentsAssign from '../../hooks/classroom/useClassroomStudentsAssign.js';
import ClassroomStudentAddModal from './ClassroomStudentAddModal.jsx';
import Pagination from '../../common/Pagination.jsx';
import { useToast } from "@/hooks/useToast.js";
import styles from './ClassroomStudentSection.module.css';

const ClassroomStudentSection = ({ classroomId }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [allStudents] = useState([]); // TODO: 전체 학생 목록 API 연동

    // 학생 목록
    const {
        students,
        loading,
        filters,
        pagination,
        handleSearch,
        handleSortChange,
        handlePageChange,
        refetch,
        removeStudentsFromList
    } = useClassroomStudentsList(classroomId);

    // 학생 배정/해제
    const {
        isAssigning,
        isRemoving,
        assignStudents,
        removeStudents
    } = useClassroomStudentsAssign({
        onAssignSuccess: (result) => {
            toast.success(`${result.successCount}명 배정 완료`);
            refetch();
            setShowAddStudent(false);
        },
        onRemoveSuccess: (result) => {
            toast.success(`${result.successCount}명 해제 완료`);
            const removedIds = result.results
                .filter(r => r.success)
                .map(r => r.studentId);
            removeStudentsFromList(removedIds);
        },
        onError: (errorMsg) => {
            toast.error(errorMsg);
        }
    });

    const handleStudentClick = (student) => {
        navigate(`/admin/users/${student.userId}`);
    };

    const handleConfirmAddStudents = async (selectedStudentIds) => {
        await assignStudents(classroomId, selectedStudentIds);
    };

    const handleRemoveStudent = async (studentId) => {
        if (window.confirm('정말 이 학생을 클래스에서 제외하시겠습니까?')) {
            await removeStudents(classroomId, [studentId]);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    // 스켈레톤 행 렌더링
    const renderSkeletonRows = () => {
        return [...Array(pagination.pageSize || 5)].map((_, index) => (
            <tr key={`skeleton-${index}`} className={styles.skeletonRow}>
                <td>
                    <div className={styles.skeletonWrapper}>
                        <div className={styles.skeleton} style={{ width: '30px' }}></div>
                    </div>
                </td>
                <td>
                    <div className={styles.skeletonWrapper}>
                        <div className={styles.skeleton} style={{ width: '80px' }}></div>
                    </div>
                </td>
                <td>
                    <div className={styles.skeletonWrapper}>
                        <div className={styles.skeleton} style={{ width: '180px' }}></div>
                    </div>
                </td>
                <td>
                    <div className={styles.skeletonWrapper}>
                        <div className={styles.skeleton} style={{ width: '100px' }}></div>
                    </div>
                </td>
                <td>
                    <div className={styles.skeletonWrapper}>
                        <div className={styles.skeleton} style={{ width: '32px', height: '32px' }}></div>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className={styles.studentContainer}>
            {/* 섹션 헤더 */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    수강생 목록
                </h2>
                <button className={styles.btnAdd} onClick={() => setShowAddStudent(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    학생 추가
                </button>
            </div>

            {/* 검색 및 정렬 */}
            <div className={styles.filterRow}>
                <div className={styles.searchBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="이름 또는 이메일로 검색..."
                        value={filters.keyword || ''}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {filters.keyword && (
                        <button
                            className={styles.btnClear}
                            onClick={() => handleSearch('')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </div>
                <select
                    className={styles.sortSelect}
                    value={`${filters.sortBy}-${filters.sortDirection}`}
                    onChange={(e) => {
                        const [sortBy, sortDirection] = e.target.value.split('-');
                        handleSortChange(sortBy, sortDirection);
                    }}
                >
                    <option value="createdAt-DESC">최신순</option>
                    <option value="createdAt-ASC">오래된순</option>
                    <option value="name-ASC">이름순</option>
                </select>
            </div>

            {/* 테이블 */}
            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>등록일</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        // 스켈레톤 UI
                        renderSkeletonRows()
                    ) : students.length > 0 ? (
                        // 실제 데이터
                        students.map((student, index) => (
                            <tr key={student.userId}>
                                <td>{pagination.currentPage * pagination.pageSize + index + 1}</td>
                                <td>
                                    <span
                                        className={styles.userName}
                                        onClick={() => handleStudentClick(student)}
                                    >
                                        {student.name}
                                    </span>
                                </td>
                                <td>{student.email}</td>
                                <td>{formatDate(student.enrolledAt)}</td>
                                <td>
                                    <button
                                        className={styles.btnIcon}
                                        onClick={() => handleRemoveStudent(student.userId)}
                                        title="제외"
                                        disabled={isRemoving}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // 빈 상태
                        <tr>
                            <td colSpan="5" className={styles.emptyCell}>
                                <div className={styles.emptyState}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                    <p>등록된 수강생이 없습니다</p>
                                    <button className={styles.btnPrimary} onClick={() => setShowAddStudent(true)}>
                                        학생 추가하기
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            {!loading && students.length > 0 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* 학생 추가 모달 */}
            <ClassroomStudentAddModal
                show={showAddStudent}
                onClose={() => setShowAddStudent(false)}
                allStudents={allStudents}
                enrolledStudents={students}
                onConfirm={handleConfirmAddStudents}
                isSubmitting={isAssigning}
            />
        </div>
    );
};

export default ClassroomStudentSection;