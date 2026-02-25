import React, { useState } from 'react';
import { useAdminUser } from '../../hooks/user/useAdminUser';
import styles from './UserCreateModal.module.css';

const UserCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const { createUser, loading } = useAdminUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'STUDENT'
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    // 이메일 유효성 검사
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 폼 유효성 검사
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = '이름은 2자 이상이어야 합니다';
        }

        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력해주세요';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        }

        if (!formData.role) {
            newErrors.role = '역할을 선택해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // 입력 시 해당 필드의 에러 제거
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await createUser(formData);
            handleClose();
            onSuccess?.();
        } catch (error) {
            // 에러는 useAdminUser 훅에서 처리
            console.error('User creation failed:', error);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', role: 'STUDENT' });
        setErrors({});
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>신규 사용자 등록</h2>
                    <button
                        className={styles.btnClose}
                        onClick={handleClose}
                        disabled={loading}
                        type="button"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <form className={styles.form} onSubmit={handleSubmit} id="createUserForm">
                        <div className={styles.formGroup}>
                            <label htmlFor="name">
                                이름 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="사용자 이름을 입력하세요"
                                disabled={loading}
                                className={errors.name ? styles.inputError : ''}
                            />
                            {errors.name && (
                                <span className={styles.errorMessage}>{errors.name}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                이메일 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="example@email.com"
                                disabled={loading}
                                className={errors.email ? styles.inputError : ''}
                            />
                            {errors.email && (
                                <span className={styles.errorMessage}>{errors.email}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="role">
                                역할 <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                disabled={loading}
                                className={errors.role ? styles.inputError : ''}
                            >
                                <option value="STUDENT">학생</option>
                                <option value="INSTRUCTOR">강사</option>
                                <option value="ADMIN">관리자</option>
                            </select>
                            {errors.role && (
                                <span className={styles.errorMessage}>{errors.role}</span>
                            )}
                        </div>

                        <div className={styles.infoBox}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4M12 8h.01"/>
                            </svg>
                            <p>계정 생성 시 임시 비밀번호가 이메일로 발송됩니다.</p>
                        </div>
                    </form>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={handleClose}
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        form="createUserForm"
                        className={styles.btnPrimary}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                                등록 중...
                            </>
                        ) : (
                            '등록하기'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCreateModal;