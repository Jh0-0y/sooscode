import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../common/Pagination.jsx';
import styles from './ClassroomStudentSection.module.css';

const STUDENTS_PER_PAGE = 5;

const ClassroomStudentSection = ({ students, onRemoveStudent, onAddStudentClick }) => {
    const navigate = useNavigate();
    const [studentPage, setStudentPage] = useState(0);

    const paginatedStudents = useMemo(() => {
        const startIndex = studentPage * STUDENTS_PER_PAGE;
        return students.slice(startIndex, startIndex + STUDENTS_PER_PAGE);
    }, [students, studentPage]);

    const totalStudentPages = Math.ceil(students.length / STUDENTS_PER_PAGE);

    const handleStudentClick = (student) => {
        navigate(`/admin/users/${student.id}`);
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'success';
        if (progress >= 50) return 'warning';
        return 'danger';
    };

    return (
        <div className={styles.studentContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    수강생 목록
                    <span className={styles.countBadge}>{students.length}명</span>
                </h2>
                <div className={styles.btnGroup}>
                    <button className={styles.btnAllAdd} onClick={onAddStudentClick}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                        엑셀 일괄 등록
                    </button>
                    <button className={styles.btnAdd} onClick={onAddStudentClick}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        학생 추가
                    </button>
                </div>
            </div>

            {students.length > 0 ? (
                <>
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
                            {paginatedStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>
                                        <span
                                            className={styles.userName}
                                            onClick={() => handleStudentClick(student)}
                                        >
                                            {student.name}
                                        </span>
                                    </td>
                                    <td>{student.email}</td>
                                    <td>{student.enrolledAt}</td>
                                    <td className={styles.actionCell}>
                                        <button
                                            className={styles.btnIcon}
                                            onClick={() => onRemoveStudent(student.id)}
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
                <div className={styles.emptyState}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <p>등록된 수강생이 없습니다</p>
                    <button className={styles.btnPrimary} onClick={onAddStudentClick}>
                        학생 추가하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClassroomStudentSection;