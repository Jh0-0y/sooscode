import React, { useState } from 'react';
import styles from './ClassroomCreateModal.module.css';

const INITIAL_FORM_DATA = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    instructorId: '', // instructorName → instructorId
    isOnline: true,   // online → isOnline
};

/**
 * 클래스 등록 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {Function} onClose - 모달 닫기 핸들러
 * @param {Function} onSubmit - 폼 제출 핸들러
 * @param {boolean} isSubmitting - 제출 중 상태
 */
const ClassroomCreateModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // instructorId를 숫자로 변환
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

                        <div className={styles.formGroup}>
                            <label htmlFor="instructorId">
                                담당 강사 ID <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                id="instructorId"
                                value={formData.instructorId}
                                onChange={(e) => handleChange('instructorId', e.target.value)}
                                placeholder="강사 ID를 입력하세요 (예: 1)"
                                required
                                disabled={isSubmitting}
                                min="1"
                            />
                            <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                * 강사의 사용자 ID를 입력하세요
                            </small>
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
