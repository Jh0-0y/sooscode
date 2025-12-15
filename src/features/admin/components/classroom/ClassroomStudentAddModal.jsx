import React, { useState, useMemo } from 'react';
import styles from './ClassroomStudentAddModal.module.css';

const ClassroomStudentAddModal = ({ show, onClose, allStudents, enrolledStudents, onConfirm }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    const availableStudents = useMemo(() => {
        return allStudents.filter(s =>
            !enrolledStudents.find(es => es.id === s.id) &&
            (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [allStudents, enrolledStudents, searchTerm]);

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleConfirm = () => {
        onConfirm(selectedStudents);
        setSelectedStudents([]);
        setSearchTerm('');
    };

    const handleClose = () => {
        setSelectedStudents([]);
        setSearchTerm('');
        onClose();
    };

    if (!show) return null;

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
                    </div>
                    <div className={styles.studentSelectList}>
                        {availableStudents.length > 0 ? (
                            availableStudents.map(student => (
                                <label key={student.id} className={styles.studentSelectItem}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => toggleStudentSelection(student.id)}
                                    />
                                    <div className={styles.studentSelectInfo}>
                                        <span className={styles.studentName}>{student.name}</span>
                                        <span className={styles.studentEmail}>{student.email}</span>
                                    </div>
                                </label>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>추가 가능한 학생이 없습니다</p>
                            </div>
                        )}
                    </div>
                    {selectedStudents.length > 0 && (
                        <div className={styles.selectedCount}>
                            {selectedStudents.length}명 선택됨
                        </div>
                    )}
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={handleClose}>취소</button>
                    <button
                        className={styles.btnPrimary}
                        onClick={handleConfirm}
                        disabled={selectedStudents.length === 0}
                    >
                        추가하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassroomStudentAddModal;