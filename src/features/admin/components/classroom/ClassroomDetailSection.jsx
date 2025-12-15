import React, { useState } from 'react';
import styles from './ClassroomDetailSection.module.css';

const ClassroomDetailSection = ({ classData, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: classData.title,
        description: classData.description,
        startDate: classData.startDate,
        endDate: classData.endDate,
        startTime: classData.startTime,
        endTime: classData.endTime,
        instructorName: classData.instructorName,
        online: classData.online,
        active: classData.active,
        thumbnail: classData.thumbnail
    });

    const formatTime = (time) => {
        return time ? time.slice(0, 5) : '';
    };

    const calculateProgress = () => {
        const today = new Date();
        const start = new Date(classData.startDate);
        const end = new Date(classData.endDate);

        if (today < start) return 0;
        if (today > end) return 100;

        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);

        return Math.round((elapsedDays / totalDays) * 100);
    };

    const calculateRemainingDays = () => {
        const today = new Date();
        const end = new Date(classData.endDate);

        if (today > end) return 0;

        const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return remainingDays;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        onUpdate(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm({
            title: classData.title,
            description: classData.description,
            startDate: classData.startDate,
            endDate: classData.endDate,
            startTime: classData.startTime,
            endTime: classData.endTime,
            instructorName: classData.instructorName,
            online: classData.online,
            active: classData.active,
            thumbnail: classData.thumbnail
        });
        setIsEditing(false);
    };

    const progress = calculateProgress();
    const remainingDays = calculateRemainingDays();

    // 수정 모드
    if (isEditing) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.thumbnailSection}>
                    {editForm.thumbnail ? (
                        <img src={editForm.thumbnail} alt={editForm.title} className={styles.thumbnail} />
                    ) : (
                        <div className={styles.thumbnailPlaceholder}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            <span>썸네일 없음</span>
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.formGroup}>
                        <label>클래스 제목 <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>담당 강사</label>
                            <input
                                type="text"
                                name="instructorName"
                                value={editForm.instructorName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>수업 유형</label>
                            <select
                                name="online"
                                value={editForm.online}
                                onChange={handleChange}
                            >
                                <option value={true}>온라인</option>
                                <option value={false}>오프라인</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>시작일</label>
                            <input
                                type="date"
                                name="startDate"
                                value={editForm.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>종료일</label>
                            <input
                                type="date"
                                name="endDate"
                                value={editForm.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>시작 시간</label>
                            <input
                                type="time"
                                name="startTime"
                                value={editForm.startTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>종료 시간</label>
                            <input
                                type="time"
                                name="endTime"
                                value={editForm.endTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>설명</label>
                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.btnSecondary} onClick={handleCancel}>
                            취소
                        </button>
                        <button className={styles.btnPrimary} onClick={handleSave}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    //기본 모드
    return (
        <div className={styles.detailContainer}>
            <div className={styles.thumbnailSection}>
                {classData.thumbnail ? (
                    <img src={classData.thumbnail} alt={classData.title} className={styles.thumbnail} />
                ) : (
                    <div className={styles.thumbnailPlaceholder}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <span>썸네일 없음</span>
                    </div>
                )}
            </div>

            <div className={styles.infoSection}>
                <div className={styles.infoGroup}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>수업 기간</span>
                            <span className={styles.infoValue}>{classData.startDate} ~ {classData.endDate}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>수업 시간</span>
                            <span className={styles.infoValue}>{formatTime(classData.startTime)} - {formatTime(classData.endTime)}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>담당 강사</span>
                            <span className={styles.infoValue}>{classData.instructorName}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>유형</span>
                            <span className={styles.infoValue}>온라인</span>
                        </div>
                    </div>
                    <div className={styles.editButtonWrapper}>
                        <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            수정
                        </button>
                    </div>
                </div>
                {classData.description && (
                    <div className={styles.descriptionBox}>
                        <span className={styles.infoLabel}>설명</span>
                        <p className={styles.description}>{classData.description}</p>
                    </div>
                )}

                <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                        <span className={styles.infoLabel}>진행률</span>
                        <span className={styles.progressPercent}>{progress}%</span>
                    </div>
                    <div className={styles.progressBarLarge}>
                        <div
                            className={styles.progressFillLarge}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className={styles.progressInfo}>
                        {remainingDays > 0 ? (
                            <span>종료까지 <strong>{remainingDays}일</strong> 남음</span>
                        ) : (
                            <span className={styles.completed}>수업 완료</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomDetailSection;