import React, { useState } from 'react';
import styles from './UserBulkUploadModal.module.css';

const UserBulkUploadModal = ({ isOpen, onClose, onSubmit }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) {
            onSubmit(selectedFile);
            setSelectedFile(null);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    };

    const handleTemplateDownload = () => {
        // 템플릿 다운로드 로직
        console.log('템플릿 다운로드');
    };

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>엑셀 일괄 등록</h2>
                    <button className={styles.btnClose} onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <form onSubmit={handleSubmit} id="bulkUploadForm">
                        <div className={styles.uploadZone}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                            </svg>
                            <p>{selectedFile ? selectedFile.name : '엑셀 파일을 선택하거나 드래그하세요'}</p>
                            <span className={styles.uploadHint}>xlsx, xls 파일만 지원</span>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className={styles.templateDownload}>
                            <button
                                type="button"
                                className={styles.btnLink}
                                onClick={handleTemplateDownload}
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
                    <button type="button" className={styles.btnSecondary} onClick={handleClose}>
                        취소
                    </button>
                    <button
                        type="submit"
                        form="bulkUploadForm"
                        className={styles.btnPrimary}
                        disabled={!selectedFile}
                    >
                        업로드
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserBulkUploadModal;