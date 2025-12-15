import React, { useState } from 'react';
import styles from './UserCreateModal.module.css';

const UserCreateModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        status: 'active'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', email: '', role: 'student', status: 'active' });
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', role: 'student', status: 'active' });
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>신규 사용자 등록</h2>
                    <button className={styles.btnClose} onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <form className={styles.form} onSubmit={handleSubmit} id="createUserForm">
                        <div className={styles.formGroup}>
                            <label htmlFor="name">이름 <span className={styles.required}>*</span></label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="사용자 이름을 입력하세요"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">이메일 <span className={styles.required}>*</span></label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="이메일 주소를 입력하세요"
                                required
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="role">역할 <span className={styles.required}>*</span></label>
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
                            <div className={styles.formGroup}>
                                <label htmlFor="status">상태 <span className={styles.required}>*</span></label>
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
                    </form>
                </div>
                <div className={styles.modalFooter}>
                    <button type="button" className={styles.btnSecondary} onClick={handleClose}>
                        취소
                    </button>
                    <button type="submit" form="createUserForm" className={styles.btnPrimary}>
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCreateModal;