import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import commonStyles from '../CommonAdmin.module.css';
import styles from './AdminClassroomDetailPage.module.css';

// 더미 데이터 (실제로는 API에서 가져옴)
const mockClassDetail = {
    classId: 1,
    thumbnail: "data:image/jpeg;base64,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",
    title: 'JAVA 기초 강의',
    description: '자바 프로그래밍의 기초를 배우는 입문 과정입니다. 변수, 자료형, 조건문, 반복문부터 객체지향 프로그래밍의 기본 개념까지 학습합니다.',
    startDate: '2025-11-15',
    endDate: '2025-12-19',
    startTime: '09:00:00',
    endTime: '12:00:00',
    instructorName: '박지민',
    studentCount: 25,
    active: true,
    online: true
};

const mockClassStudents = [
    { id: 1, name: '김철수', email: 'kim@example.com', enrolledAt: '2025-01-15', progress: 75, lastAccess: '2025-01-10' },
    { id: 2, name: '정민호', email: 'jung@example.com', enrolledAt: '2025-01-16', progress: 82, lastAccess: '2025-01-10' },
    { id: 3, name: '홍길동', email: 'hong@example.com', enrolledAt: '2025-01-17', progress: 60, lastAccess: '2025-01-09' },
    { id: 4, name: '이민수', email: 'leemin@example.com', enrolledAt: '2025-01-18', progress: 90, lastAccess: '2025-01-10' },
    { id: 5, name: '강예진', email: 'kang@example.com', enrolledAt: '2025-01-20', progress: 45, lastAccess: '2025-01-08' },
    { id: 6, name: '박서연', email: 'parksy@example.com', enrolledAt: '2025-01-21', progress: 55, lastAccess: '2025-01-09' },
];

const mockAllStudents = [
    { id: 9, name: '윤도현', email: 'yoondh@example.com' },
    { id: 10, name: '정현영', email: 'jungh@example.com' },
    { id: 11, name: '정지영', email: 'jungj@example.com' },
    { id: 12, name: '고상주', email: 'kosj@example.com' },
];

const STUDENTS_PER_PAGE = 5;

const AdminClassroomDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentPage, setStudentPage] = useState(0);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState([]);

    // 클래스 데이터 로드
    useEffect(() => {
        // 실제로는 API 호출
        // const response = await classApi.getDetail(id);
        setClassData(mockClassDetail);
        setClassStudents(mockClassStudents);
        setLoading(false);
    }, [id]);

    // 진행률 계산 (날짜 기준)
    const calculateProgress = () => {
        if (!classData) return 0;

        const today = new Date();
        const start = new Date(classData.startDate);
        const end = new Date(classData.endDate);

        if (today < start) return 0;
        if (today > end) return 100;

        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);

        return Math.round((elapsedDays / totalDays) * 100);
    };

    // 남은 일수 계산
    const calculateRemainingDays = () => {
        if (!classData) return 0;

        const today = new Date();
        const end = new Date(classData.endDate);

        if (today > end) return 0;

        const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return remainingDays;
    };

    // 페이지네이션 적용된 수강생 목록
    const paginatedStudents = useMemo(() => {
        const startIndex = studentPage * STUDENTS_PER_PAGE;
        return classStudents.slice(startIndex, startIndex + STUDENTS_PER_PAGE);
    }, [classStudents, studentPage]);

    const totalStudentPages = Math.ceil(classStudents.length / STUDENTS_PER_PAGE);

    // 추가 가능한 학생 필터링
    const availableStudents = useMemo(() => {
        return mockAllStudents.filter(s =>
            !classStudents.find(cs => cs.id === s.id) &&
            (s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(studentSearchTerm.toLowerCase()))
        );
    }, [classStudents, studentSearchTerm]);

    // 목록으로 돌아가기
    const handleBack = () => {
        navigate('/admin/classes');
    };

    // 클래스 수정 페이지로 이동
    const handleEditClass = () => {
        navigate(`/admin/classes/${id}/edit`);
    };

    // 학생 추가 모달
    const handleOpenAddStudent = () => {
        setShowAddStudent(true);
        setStudentSearchTerm('');
        setSelectedStudentsToAdd([]);
    };

    const toggleStudentSelection = (studentId) => {
        setSelectedStudentsToAdd(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleConfirmAddStudents = () => {
        const newStudents = mockAllStudents
            .filter(s => selectedStudentsToAdd.includes(s.id))
            .map(s => ({
                ...s,
                enrolledAt: new Date().toISOString().split('T')[0],
                progress: 0,
                lastAccess: '-'
            }));
        setClassStudents([...classStudents, ...newStudents]);
        setShowAddStudent(false);
        const newTotalPages = Math.ceil((classStudents.length + newStudents.length) / STUDENTS_PER_PAGE);
        setStudentPage(newTotalPages - 1);
    };

    // 학생 삭제
    const handleRemoveStudent = (studentId) => {
        if (window.confirm('정말 이 학생을 클래스에서 제외하시겠습니까?')) {
            const newStudents = classStudents.filter(s => s.id !== studentId);
            setClassStudents(newStudents);
            const newTotalPages = Math.ceil(newStudents.length / STUDENTS_PER_PAGE);
            if (studentPage >= newTotalPages && newTotalPages > 0) {
                setStudentPage(newTotalPages - 1);
            }
        }
    };

    // 사용자 상세로 이동
    const handleStudentClick = (student) => {
        navigate(`/admin/users/${student.id}`);
    };

    // 시간 포맷팅
    const formatTime = (time) => {
        return time ? time.slice(0, 5) : '';
    };

    // 진도율 색상
    const getProgressColor = (progress) => {
        if (progress >= 80) return 'success';
        if (progress >= 50) return 'warning';
        return 'danger';
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

    if (!classData) {
        return (
            <div className={commonStyles.adminPage}>
                <div className={commonStyles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p>클래스를 찾을 수 없습니다</p>
                    <button className={commonStyles.btnPrimary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const progress = calculateProgress();
    const remainingDays = calculateRemainingDays();

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
                    <h1 className={commonStyles.pageTitle}>{classData.title}</h1>
                    <span className={`${styles.typeBadge} ${classData.online ? styles.online : styles.offline}`}>
                        {classData.online ? '온라인' : '오프라인'}
                    </span>
                    <span className={`${commonStyles.statusBadge} ${classData.active ? commonStyles.active : commonStyles.inactive}`}>
                        {classData.active ? '활성' : '비활성'}
                    </span>
                </div>
                <div className={commonStyles.headerActions}>
                    <button className={commonStyles.btnSecondary} onClick={handleEditClass}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        클래스 수정
                    </button>
                </div>
            </div>

            {/* 클래스 정보 섹션 */}
            <div className={styles.detailHeader}>
                {/* 썸네일 */}
                <div className={styles.thumbnailSection}>
                    {classData.thumbnail ? (
                        <img src={classData.thumbnail} alt={classData.title} className={styles.thumbnail} />
                    ) : (
                        <div className={styles.thumbnailPlaceholder}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            <span>썸네일 없음</span>
                        </div>
                    )}
                </div>

                {/* 기본 정보 */}
                <div className={styles.infoSection}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>담당 강사</span>
                            <span className={styles.infoValue}>{classData.instructorName}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>총 학생 수</span>
                            <span className={styles.infoValue}>{classData.studentCount}명</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>수업 기간</span>
                            <span className={styles.infoValue}>{classData.startDate} ~ {classData.endDate}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>수업 시간</span>
                            <span className={styles.infoValue}>{formatTime(classData.startTime)} - {formatTime(classData.endTime)}</span>
                        </div>
                    </div>

                    {classData.description && (
                        <div className={styles.descriptionBox}>
                            <span className={styles.infoLabel}>설명</span>
                            <p className={styles.description}>{classData.description}</p>
                        </div>
                    )}

                    {/* 진행률 */}
                    <div className={styles.progressSection}>
                        <div className={styles.progressHeader}>
                            <span className={styles.infoLabel}>진행률</span>
                            <span className={styles.progressPercent}>{progress}%</span>
                        </div>
                        <div className={styles.progressBarLarge}>
                            <div
                                className={styles.progressFillLarge}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className={styles.progressInfo}>
                            {remainingDays > 0 ? (
                                <span>종료까지 <strong>{remainingDays}일</strong> 남음</span>
                            ) : (
                                <span className={styles.completed}>수업 완료</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 수강생 목록 섹션 */}
            <div className={styles.studentSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        수강생 목록
                        <span className={styles.countBadge}>{classStudents.length}명</span>
                    </h2>
                    <button className={`${commonStyles.btnPrimary} ${commonStyles.btnSm}`} onClick={handleOpenAddStudent}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        학생 추가
                    </button>
                </div>

                {classStudents.length > 0 ? (
                    <>
                        <div className={commonStyles.tableContainer}>
                            <table className={commonStyles.dataTable}>
                                <thead>
                                <tr>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>등록일</th>
                                    <th>진도율</th>
                                    <th>최근 접속</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <span
                                                className={`${commonStyles.userName} ${commonStyles.clickable}`}
                                                onClick={() => handleStudentClick(student)}
                                            >
                                                {student.name}
                                            </span>
                                        </td>
                                        <td>{student.email}</td>
                                        <td>{student.enrolledAt}</td>
                                        <td>
                                            <div className={styles.progressCell}>
                                                <div className={styles.progressBar}>
                                                    <div
                                                        className={`${styles.progressFill} ${styles[getProgressColor(student.progress)]}`}
                                                        style={{ width: `${student.progress}%` }}
                                                    />
                                                </div>
                                                <span className={styles.progressText}>{student.progress}%</span>
                                            </div>
                                        </td>
                                        <td>{student.lastAccess}</td>
                                        <td>
                                            <button
                                                className={`${commonStyles.btnIcon} ${commonStyles.danger}`}
                                                onClick={() => handleRemoveStudent(student.id)}
                                                title="제외"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={studentPage}
                            totalPages={totalStudentPages}
                            onPageChange={setStudentPage}
                        />
                    </>
                ) : (
                    <div className={`${commonStyles.emptyState} ${commonStyles.small}`}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <p>등록된 수강생이 없습니다</p>
                        <button className={commonStyles.btnPrimary} onClick={handleOpenAddStudent}>
                            학생 추가하기
                        </button>
                    </div>
                )}
            </div>

            {/* 학생 추가 모달 */}
            {showAddStudent && (
                <div className={commonStyles.modalOverlay} onClick={() => setShowAddStudent(false)}>
                    <div className={`${commonStyles.modal} ${commonStyles.modalLg}`} onClick={(e) => e.stopPropagation()}>
                        <div className={commonStyles.modalHeader}>
                            <h2>학생 추가</h2>
                            <button className={commonStyles.btnClose} onClick={() => setShowAddStudent(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className={commonStyles.modalBody}>
                            <div className={`${commonStyles.searchBox} ${commonStyles.modalSearch}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="M21 21l-4.35-4.35"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="이름 또는 이메일로 검색..."
                                    value={studentSearchTerm}
                                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className={styles.studentSelectList}>
                                {availableStudents.length > 0 ? (
                                    availableStudents.map(student => (
                                        <label key={student.id} className={styles.studentSelectItem}>
                                            <input
                                                type="checkbox"
                                                checked={selectedStudentsToAdd.includes(student.id)}
                                                onChange={() => toggleStudentSelection(student.id)}
                                            />
                                            <div className={styles.studentSelectInfo}>
                                                <span className={styles.studentName}>{student.name}</span>
                                                <span className={styles.studentEmail}>{student.email}</span>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className={`${commonStyles.emptyState} ${commonStyles.small}`}>
                                        <p>추가 가능한 학생이 없습니다</p>
                                    </div>
                                )}
                            </div>
                            {selectedStudentsToAdd.length > 0 && (
                                <div className={styles.selectedCount}>
                                    {selectedStudentsToAdd.length}명 선택됨
                                </div>
                            )}
                        </div>
                        <div className={commonStyles.modalFooter}>
                            <button className={commonStyles.btnSecondary} onClick={() => setShowAddStudent(false)}>취소</button>
                            <button
                                className={commonStyles.btnPrimary}
                                onClick={handleConfirmAddStudents}
                                disabled={selectedStudentsToAdd.length === 0}
                            >
                                추가하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClassroomDetailPage;