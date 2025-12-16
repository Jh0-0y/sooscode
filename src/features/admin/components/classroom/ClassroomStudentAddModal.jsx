import React, { useState, useEffect } from 'react';
import useAvailableStudentsSearch from '../../hooks/classroom/useAvailableStudentsSearch';
import styles from './ClassroomStudentAddModal.module.css';

/**
 * 학생 추가 모달
 * @param {boolean} show - 모달 표시 여부
 * @param {Function} onClose - 닫기 핸들러
 * @param {number} classId - 클래스 ID
 * @param {Function} onConfirm - 확인 핸들러 (studentIds 배열 전달)
 * @param {boolean} isSubmitting - 제출 중 상태
 */
const ClassroomStudentAddModal = ({ show, onClose, classId, onConfirm, isSubmitting = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    // 학생 검색 Hook
    const { students, loading, searchStudents } = useAvailableStudentsSearch(classId);

    // 모달 열릴 때 초기 검색 (전체 목록)
    useEffect(() => {
        if (show && classId) {
            searchStudents('');
        }
    }, [show, classId, searchStudents]);

    // 검색어 변경 시 디바운스 적용
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(() => {
            searchStudents(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, show, searchStudents]);

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleConfirm = () => {
        onConfirm(selectedStudents);
        handleClose();
    };

    const handleClose = () => {
        setSelectedStudents([]);
        setSearchTerm('');
        onClose();
    };

    if (!show) return null;

    // 선택된 학생 정보 가져오기
    const selectedStudentNames = students
        .filter(s => selectedStudents.includes(s.userId))
        .map(s => s.name)
        .join(', ');

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>학생 추가</h2>
                    <button className={styles.btnClose} onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* 검색창 */}
                    <div className={styles.searchBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21l-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="이름 또는 이메일로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className={styles.btnClearSearch}
                                onClick={() => setSearchTerm('')}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* 선택된 학생 표시 */}
                    {selectedStudents.length > 0 && (
                        <div className={styles.selectedInfo}>
                            <span className={styles.selectedCount}>
                                {selectedStudents.length}명 선택됨
                            </span>
                            <span className={styles.selectedNames}>
                                {selectedStudentNames}
                            </span>
                        </div>
                    )}

                    {/* 학생 목록 */}
                    <div className={styles.studentSelectList}>
                        {loading ? (
                            // 스켈레톤 UI
                            [...Array(5)].map((_, index) => (
                                <div key={`skeleton-${index}`} className={styles.skeletonItem}>
                                    <div className={styles.skeletonCheckbox}></div>
                                    <div className={styles.skeletonInfo}>
                                        <div className={styles.skeleton} style={{ width: '120px', height: '16px' }}></div>
                                        <div className={styles.skeleton} style={{ width: '180px', height: '14px', marginTop: '4px' }}></div>
                                    </div>
                                </div>
                            ))
                        ) : students.length > 0 ? (
                            students.map(student => (
                                <label key={student.userId} className={styles.studentSelectItem}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.userId)}
                                        onChange={() => toggleStudentSelection(student.userId)}
                                    />
                                    <div className={styles.studentSelectInfo}>
                                        <span className={styles.studentName}>{student.name}</span>
                                        <span className={styles.studentEmail}>{student.email}</span>
                                    </div>
                                </label>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                <p>추가 가능한 학생이 없습니다</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        className={styles.btnSecondary}
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        className={styles.btnPrimary}
                        onClick={handleConfirm}
                        disabled={selectedStudents.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? '추가 중...' : `${selectedStudents.length}명 추가하기`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassroomStudentAddModal;
