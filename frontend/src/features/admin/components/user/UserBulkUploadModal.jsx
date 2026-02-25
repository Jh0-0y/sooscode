import React, { useState, useRef } from 'react';
import { useAdminUser } from '../../hooks/user/useAdminUser';
import styles from './UserBulkUploadModal.module.css';

const UserBulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
    const { bulkCreateUsers, downloadExcelTemplate, loading } = useAdminUser();
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const validateAndSetFile = (file) => {
        if (!file) return;

        // 엑셀 파일 확인
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (!validTypes.includes(file.type)) {
            alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 확인 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('파일 크기는 10MB를 초과할 수 없습니다.');
            return;
        }

        setSelectedFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        validateAndSetFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        validateAndSetFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        try {
            await bulkCreateUsers(selectedFile);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    const handleTemplateDownload = async () => {
        await downloadExcelTemplate();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>엑셀 일괄 등록</h2>
                    <button className={styles.btnClose} onClick={handleClose} disabled={loading}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* 안내 정보 */}
                    <div className={styles.infoBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                        <div className={styles.infoContent}>
                            <p className={styles.infoTitle}>업로드 안내</p>
                            <ul className={styles.infoList}>
                                <li>템플릿 양식에 맞춰 데이터를 입력해주세요</li>
                                <li>최대 1,000명까지 한번에 등록 가능합니다</li>
                                <li>파일 크기는 10MB를 초과할 수 없습니다</li>
                                <li>이메일 중복 시 해당 행은 건너뜁니다</li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} id="bulkUploadForm">
                        <div
                            className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ''} ${selectedFile ? styles.hasFile : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {!selectedFile ? (
                                <>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                    </svg>
                                    <p>엑셀 파일을 선택하거나 드래그하세요</p>
                                    <span className={styles.uploadHint}>xlsx, xls 파일만 지원 (최대 10MB)</span>
                                </>
                            ) : (
                                <div className={styles.fileInfo}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                    <div className={styles.fileDetails}>
                                        <p className={styles.fileName}>{selectedFile.name}</p>
                                        <p className={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.btnRemove}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.templateDownload}>
                            <button
                                type="button"
                                className={styles.btnLink}
                                onClick={handleTemplateDownload}
                                disabled={loading}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                                </svg>
                                템플릿 파일 다운로드
                            </button>
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
                        form="bulkUploadForm"
                        className={styles.btnPrimary}
                        disabled={!selectedFile || loading}
                    >
                        {loading ? '업로드 중...' : '업로드'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserBulkUploadModal;