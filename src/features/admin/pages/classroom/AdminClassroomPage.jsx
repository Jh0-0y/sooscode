import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import commonStyles from '../CommonAdmin.module.css';
import styles from './AdminClassroomPage.module.css';

// 더미 데이터 (실제로는 API에서 가져옴)
const mockClasses = [
    {
        classId: 1,
        thumbnail: null,
        title: 'JAVA 기초 강의',
        description: '자바 프로그래밍의 기초를 배우는 입문 과정입니다.',
        startDate: '2025-11-15',
        endDate: '2025-12-19',
        startTime: '09:00:00',
        endTime: '12:00:00',
        instructorName: '박지민',
        studentCount: 25,
        active: true,
        online: true
    },
    {
        classId: 2,
        thumbnail: null,
        title: 'Spring Boot 입문',
        description: 'Spring Boot를 활용한 백엔드 개발 입문 과정입니다.',
        startDate: '2025-02-01',
        endDate: '2025-04-01',
        startTime: '14:00:00',
        endTime: '17:00:00',
        instructorName: '이강사',
        studentCount: 20,
        active: true,
        online: false
    },
    {
        classId: 3,
        thumbnail: null,
        title: 'React 심화',
        description: 'React Hooks와 상태관리를 심도있게 학습합니다.',
        startDate: '2025-03-01',
        endDate: '2025-05-01',
        startTime: '19:00:00',
        endTime: '21:00:00',
        instructorName: '김강사',
        studentCount: 18,
        active: true,
        online: true
    },
    {
        classId: 4,
        thumbnail: null,
        title: 'Python 데이터분석',
        description: 'Python을 활용한 데이터 분석 기초 과정입니다.',
        startDate: '2024-11-01',
        endDate: '2025-01-01',
        startTime: '10:00:00',
        endTime: '13:00:00',
        instructorName: '정강사',
        studentCount: 28,
        active: false,
        online: true
    },
    {
        classId: 5,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 6,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 7,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 8,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 9,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 10,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 11,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
    {
        classId: 12,
        thumbnail: null,
        title: 'Vue.js 실전',
        description: 'Vue.js를 활용한 실전 프로젝트 개발 과정입니다.',
        startDate: '2025-04-01',
        endDate: '2025-06-01',
        startTime: '14:00:00',
        endTime: '16:00:00',
        instructorName: '최강사',
        studentCount: 12,
        active: false,
        online: false
    },
];

const CLASSES_PER_PAGE = 10;

const AdminClassroomPage = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('all');
    const [filterOnline, setFilterOnline] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '18:00',
        instructorName: '',
        online: true,
        active: true
    });
    const [classPage, setClassPage] = useState(0);

    // 데이터 로드
    useEffect(() => {
        // 실제로는 API 호출
        // const response = await classApi.getList();
        setClasses(mockClasses);
        setLoading(false);
    }, []);

    // 필터링된 클래스 목록
    const filteredClasses = useMemo(() => {
        return classes.filter(cls => {
            const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesActive = filterActive === 'all' ||
                (filterActive === 'active' && cls.active) ||
                (filterActive === 'inactive' && !cls.active);
            const matchesOnline = filterOnline === 'all' ||
                (filterOnline === 'online' && cls.online) ||
                (filterOnline === 'offline' && !cls.online);
            return matchesSearch && matchesActive && matchesOnline;
        });
    }, [classes, searchTerm, filterActive, filterOnline]);

    // 페이지네이션 적용된 클래스 목록
    const paginatedClasses = useMemo(() => {
        const startIndex = classPage * CLASSES_PER_PAGE;
        return filteredClasses.slice(startIndex, startIndex + CLASSES_PER_PAGE);
    }, [filteredClasses, classPage]);

    const totalClassPages = Math.ceil(filteredClasses.length / CLASSES_PER_PAGE);

    // 필터 변경 시 페이지 초기화
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setClassPage(0);
    };

    const handleFilterActiveChange = (value) => {
        setFilterActive(value);
        setClassPage(0);
    };

    const handleFilterOnlineChange = (value) => {
        setFilterOnline(value);
        setClassPage(0);
    };

    // 클래스 상세 페이지로 이동
    const handleClassClick = (cls) => {
        navigate(`/admin/classes/${cls.classId}`);
    };

    // 신규 클래스 등록 폼 열기
    const handleAddClass = () => {
        setFormMode('create');
        setFormData({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            startTime: '09:00',
            endTime: '18:00',
            instructorName: '',
            online: true,
            active: true
        });
        setViewMode('form');
    };

    // 클래스 수정 폼 열기
    const handleEditClass = (cls, e) => {
        e.stopPropagation();
        setFormMode('edit');
        setFormData({
            ...cls,
            startTime: cls.startTime.slice(0, 5),
            endTime: cls.endTime.slice(0, 5)
        });
        setViewMode('form');
    };

    // 폼 제출
    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (formMode === 'create') {
            const newClass = {
                ...formData,
                classId: Math.max(...classes.map(c => c.classId)) + 1,
                startTime: formData.startTime + ':00',
                endTime: formData.endTime + ':00',
                studentCount: 0,
                thumbnail: null
            };
            setClasses([...classes, newClass]);
        } else {
            setClasses(classes.map(c =>
                c.classId === formData.classId
                    ? { ...c, ...formData, startTime: formData.startTime + ':00', endTime: formData.endTime + ':00' }
                    : c
            ));
        }
        setViewMode('list');
    };

    // 목록으로 돌아가기
    const handleBack = () => {
        setViewMode('list');
    };

    // 엑셀 다운로드
    const handleExcelDownload = () => {
        alert('클래스 목록을 엑셀 파일로 다운로드합니다.');
    };

    // 시간 포맷팅 (HH:mm:ss -> HH:mm)
    const formatTime = (time) => {
        return time ? time.slice(0, 5) : '';
    };

    // 날짜 포맷팅
    const formatDateRange = (startDate, endDate) => {
        return `${startDate} ~ ${endDate}`;
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
                        {viewMode === 'list' && '클래스 관리'}
                        {viewMode === 'form' && (formMode === 'create' ? '신규 클래스 등록' : '클래스 정보 수정')}
                    </h1>
                </div>
                {viewMode === 'list' && (
                    <div className={commonStyles.headerActions}>
                        <button className={commonStyles.btnSecondary} onClick={handleExcelDownload}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                            </svg>
                            엑셀 다운로드
                        </button>
                        <button className={commonStyles.btnPrimary} onClick={handleAddClass}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            신규 등록
                        </button>
                    </div>
                )}
            </div>

            {/* 클래스 목록 뷰 */}
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
                                placeholder="클래스명 또는 강사명으로 검색..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div className={commonStyles.filterGroup}>
                            <select value={filterOnline} onChange={(e) => handleFilterOnlineChange(e.target.value)}>
                                <option value="all">전체 방식</option>
                                <option value="online">온라인</option>
                                <option value="offline">오프라인</option>
                            </select>
                            <select value={filterActive} onChange={(e) => handleFilterActiveChange(e.target.value)}>
                                <option value="all">전체 상태</option>
                                <option value="active">활성</option>
                                <option value="inactive">비활성</option>
                            </select>
                        </div>
                    </div>

                    {/* 클래스 테이블 */}
                    {paginatedClasses.length > 0 ? (
                        <>
                            <div className={commonStyles.tableContainer}>
                                <table className={commonStyles.dataTable}>
                                    <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>클래스명</th>
                                        <th>설명</th>
                                        <th>기간</th>
                                        <th>시간</th>
                                        <th>강사</th>
                                        <th>학생 수</th>
                                        <th>방식</th>
                                        <th>상태</th>
                                        <th>관리</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginatedClasses.map((cls, index) => (
                                        <tr
                                            key={cls.classId}
                                            className={commonStyles.clickableRow}
                                            onClick={() => handleClassClick(cls)}
                                        >
                                            <td>{classPage * CLASSES_PER_PAGE + index + 1}</td>
                                            <td>
                                                <span className={`${commonStyles.userName} ${commonStyles.clickable}`}>
                                                    {cls.title}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={styles.descriptionCell}>
                                                    {cls.description}
                                                </span>
                                            </td>
                                            <td className={styles.dateCell}>
                                                {formatDateRange(cls.startDate, cls.endDate)}
                                            </td>
                                            <td>
                                                {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                            </td>
                                            <td>{cls.instructorName}</td>
                                            <td>{cls.studentCount}명</td>
                                            <td>
                                                <span className={`${styles.typeBadge} ${cls.online ? styles.online : styles.offline}`}>
                                                    {cls.online ? '온라인' : '오프라인'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${commonStyles.statusBadge} ${cls.active ? commonStyles.active : commonStyles.inactive}`}>
                                                    {cls.active ? '활성' : '비활성'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={commonStyles.btnIcon}
                                                    onClick={(e) => handleEditClass(cls, e)}
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
                                currentPage={classPage}
                                totalPages={totalClassPages}
                                onPageChange={setClassPage}
                            />
                        </>
                    ) : (
                        <div className={commonStyles.emptyState}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                            <p>검색 결과가 없습니다</p>
                        </div>
                    )}
                </>
            )}

            {/* 클래스 등록/수정 폼 */}
            {viewMode === 'form' && (
                <div className={commonStyles.formView}>
                    <form className={commonStyles.adminForm} onSubmit={handleSubmitForm}>
                        <div className={commonStyles.formGroup}>
                            <label htmlFor="title">클래스명 <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="클래스명을 입력하세요"
                                required
                            />
                        </div>
                        <div className={commonStyles.formGroup}>
                            <label htmlFor="description">설명</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="클래스에 대한 설명을 입력하세요"
                                rows={3}
                            />
                        </div>
                        <div className={commonStyles.formGroup}>
                            <label htmlFor="instructorName">담당 강사 <span className="required">*</span></label>
                            <input
                                type="text"
                                id="instructorName"
                                value={formData.instructorName}
                                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                                placeholder="강사명을 입력하세요"
                                required
                            />
                        </div>
                        <div className={commonStyles.formRow}>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="startDate">시작일 <span className="required">*</span></label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="endDate">종료일 <span className="required">*</span></label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className={commonStyles.formRow}>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="startTime">시작 시간 <span className="required">*</span></label>
                                <input
                                    type="time"
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="endTime">종료 시간 <span className="required">*</span></label>
                                <input
                                    type="time"
                                    id="endTime"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className={commonStyles.formRow}>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="online">수업 방식 <span className="required">*</span></label>
                                <select
                                    id="online"
                                    value={formData.online ? 'online' : 'offline'}
                                    onChange={(e) => setFormData({ ...formData, online: e.target.value === 'online' })}
                                >
                                    <option value="online">온라인</option>
                                    <option value="offline">오프라인</option>
                                </select>
                            </div>
                            <div className={commonStyles.formGroup}>
                                <label htmlFor="active">상태 <span className="required">*</span></label>
                                <select
                                    id="active"
                                    value={formData.active ? 'active' : 'inactive'}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
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
        </div>
    );
};

export default AdminClassroomPage;