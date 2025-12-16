import React, { useState, useEffect, useRef } from 'react';
import useInstructorSearch from '../../hooks/classroom/useInstructorSearch';
import styles from './ClassroomCreateModal.module.css';

const INITIAL_FORM_DATA = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    instructorId: '',
    instructorName: '',
    isOnline: true,
};

const ClassroomCreateModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [instructorInput, setInstructorInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const { instructors, loading, searchInstructors } = useInstructorSearch();

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 검색어 변경 시 디바운스 검색
    useEffect(() => {
        if (!instructorInput || !isOpen) return;

        const timer = setTimeout(() => {
            searchInstructors(instructorInput);
        }, 300);

        return () => clearTimeout(timer);
    }, [instructorInput, isOpen, searchInstructors]);

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setInstructorInput('');
        setShowDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.instructorId) {
            alert('강사를 선택해주세요.');
            return;
        }

        const submitData = {
            ...formData,
            instructorId: parseInt(formData.instructorId, 10)
        };

        onSubmit(submitData);
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 강사 입력 필드 변경
    const handleInstructorInputChange = (e) => {
        const value = e.target.value;
        setInstructorInput(value);
        setShowDropdown(true);

        // 입력이 지워지면 선택 초기화
        if (!value) {
            setFormData(prev => ({
                ...prev,
                instructorId: '',
                instructorName: ''
            }));
        }
    };

    // 강사 선택
    const handleInstructorSelect = (instructor) => {
        setFormData(prev => ({
            ...prev,
            instructorId: instructor.userId,
            instructorName: instructor.name
        }));
        setInstructorInput(instructor.name);
        setShowDropdown(false);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>신규 클래스 등록</h2>
                    <button className={styles.btnClose} onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <form id="classroomForm" onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">
                                클래스명 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="클래스명을 입력하세요"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description">설명</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="클래스에 대한 설명을 입력하세요"
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* 강사 검색 Autocomplete */}
                        <div className={styles.formGroup} ref={dropdownRef}>
                            <label htmlFor="instructor">
                                담당 강사 <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.autocompleteWrapper}>
                                <input
                                    type="text"
                                    id="instructor"
                                    value={instructorInput}
                                    onChange={handleInstructorInputChange}
                                    onFocus={() => instructorInput && setShowDropdown(true)}
                                    placeholder="강사 이름 또는 이메일을 입력하세요"
                                    required
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                />
                                {showDropdown && instructorInput && (
                                    <div className={styles.dropdown}>
                                        {loading ? (
                                            <div className={styles.dropdownItem} style={{ cursor: 'default' }}>
                                                <span>검색 중...</span>
                                            </div>
                                        ) : instructors.length > 0 ? (
                                            instructors.map(instructor => (
                                                <div
                                                    key={instructor.userId}
                                                    className={styles.dropdownItem}
                                                    onClick={() => handleInstructorSelect(instructor)}
                                                >
                                                    <div className={styles.instructorInfo}>
                                                        <span className={styles.instructorName}>{instructor.name}</span>
                                                        <span className={styles.instructorEmail}>{instructor.email}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className={styles.dropdownItem} style={{ cursor: 'default' }}>
                                                <span>검색 결과가 없습니다</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {formData.instructorId && (
                                <small className={styles.selectedInfo}>
                                    ✓ 선택됨: {formData.instructorName}
                                </small>
                            )}
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="startDate">
                                    시작일 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={formData.startDate}
                                    onChange={(e) => handleChange('startDate', e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="endDate">
                                    종료일 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={formData.endDate}
                                    onChange={(e) => handleChange('endDate', e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="startTime">
                                    시작 시간 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={(e) => handleChange('startTime', e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="endTime">
                                    종료 시간 <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    value={formData.endTime}
                                    onChange={(e) => handleChange('endTime', e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="isOnline">
                                수업 유형 <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="isOnline"
                                value={formData.isOnline}
                                onChange={(e) => handleChange('isOnline', e.target.value === 'true')}
                                disabled={isSubmitting}
                            >
                                <option value="true">온라인</option>
                                <option value="false">오프라인</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        form="classroomForm"
                        className={styles.btnPrimary}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '등록 중...' : '등록하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassroomCreateModal;