import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClassroomDetail from '../../hooks/classroom/useClassroomDetail.js';
import { useClassroomUpdate, useClassroomDelete } from '../../hooks/classroom/useClassroomUpdate.js';
import { useToast } from "@/hooks/useToast.js";
import styles from './ClassroomDetailSection.module.css';

const ClassroomDetailSection = ({ classroomId }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // 클래스 상세 정보
    const {
        classData,
        loading,
        error,
        updateLocalData
    } = useClassroomDetail(classroomId);

    // 수정 폼 상태
    const [editForm, setEditForm] = useState({});

    // 수정 훅
    const {
        isSubmitting: isUpdating,
        handleSubmit: handleUpdateSubmit
    } = useClassroomUpdate({
        onSuccess: (updatedClass) => {
            toast.success('클래스 정보가 수정되었습니다.');
            updateLocalData(updatedClass);
            setIsEditing(false);
        },
        onError: (errorMsg) => {
            toast.error(errorMsg);
        }
    });

    // 삭제 훅
    const {
        isConfirmOpen,
        openConfirm,
        closeConfirm,
        isDeleting,
        targetClass: deleteTargetClass,
        handleDelete
    } = useClassroomDelete({
        onSuccess: () => {
            toast.success('클래스가 삭제되었습니다.');
            navigate('/admin/classes');
        },
        onError: (errorMsg) => {
            toast.error(errorMsg);
        }
    });

    // 편집 모드 시작
    const handleStartEdit = () => {
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
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        handleUpdateSubmit(editForm);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const formatTime = (time) => {
        return time ? time.slice(0, 5) : '';
    };

    const calculateProgress = () => {
        if (!classData) return 0;
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
        if (!classData) return 0;
        const today = new Date();
        const end = new Date(classData.endDate);

        if (today > end) return 0;

        const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return remainingDays;
    };

    if (error) {
        return null;
    }

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
                            value={editForm.description || ''}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.btnSecondary} onClick={handleCancel} disabled={isUpdating}>
                            취소
                        </button>
                        <button className={styles.btnPrimary} onClick={handleSave} disabled={isUpdating}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            {isUpdating ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 기본 모드 - 로딩 중이면 스켈레톤, 아니면 실제 데이터
    return (
        <div className={styles.detailContainer}>
            <div className={styles.thumbnailSection}>
                {loading ? (
                    <div className={styles.skeletonThumbnail}></div>
                ) : classData?.thumbnail ? (
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
                            {loading ? (
                                <div className={styles.skeletonText}></div>
                            ) : (
                                <span className={styles.infoValue}>{classData?.startDate} ~ {classData?.endDate}</span>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>수업 시간</span>
                            {loading ? (
                                <div className={styles.skeletonText}></div>
                            ) : (
                                <span className={styles.infoValue}>{formatTime(classData?.startTime)} - {formatTime(classData?.endTime)}</span>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>담당 강사</span>
                            {loading ? (
                                <div className={styles.skeletonText}></div>
                            ) : (
                                <span className={styles.infoValue}>{classData?.instructorName}</span>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>유형</span>
                            {loading ? (
                                <div className={styles.skeletonText}></div>
                            ) : (
                                <span className={styles.infoValue}>{classData?.online ? '온라인' : '오프라인'}</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.editButtonWrapper}>
                        {loading ? (
                            <>
                                <div className={styles.skeletonButton}></div>
                                <div className={styles.skeletonButton}></div>
                            </>
                        ) : (
                            <>
                                <button className={styles.btnEdit} onClick={handleStartEdit}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    수정
                                </button>
                                <button className={styles.btnDanger} onClick={() => openConfirm(classData)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {classData?.description && !loading && (
                    <div className={styles.descriptionBox}>
                        <span className={styles.infoLabel}>설명</span>
                        <p className={styles.description}>{classData.description}</p>
                    </div>
                )}

                <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                        <span className={styles.infoLabel}>진행률</span>
                        {loading ? (
                            <div className={styles.skeletonText} style={{width: '40px'}}></div>
                        ) : (
                            <span className={styles.progressPercent}>{progress}%</span>
                        )}
                    </div>
                    <div className={styles.progressBarLarge}>
                        {loading ? (
                            <div className={styles.skeletonProgress}></div>
                        ) : (
                            <div
                                className={styles.progressFillLarge}
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </div>
                    <div className={styles.progressInfo}>
                        {loading ? (
                            <div className={styles.skeletonText} style={{width: '100px'}}></div>
                        ) : remainingDays > 0 ? (
                            <span>종료까지 <strong>{remainingDays}일</strong> 남음</span>
                        ) : (
                            <span className={styles.completed}>수업 완료</span>
                        )}
                    </div>
                </div>
            </div>

            {/* 삭제 확인 다이얼로그 */}
            {isConfirmOpen && (
                <div className={styles.confirmOverlay} onClick={closeConfirm}>
                    <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
                        <h3>클래스 삭제</h3>
                        <p>정말 <strong>{deleteTargetClass?.title}</strong> 클래스를 삭제하시겠습니까?</p>
                        <p className={styles.warning}>이 작업은 되돌릴 수 없습니다.</p>
                        <div className={styles.confirmActions}>
                            <button
                                className={styles.btnSecondary}
                                onClick={closeConfirm}
                                disabled={isDeleting}
                            >
                                취소
                            </button>
                            <button
                                className={styles.btnDanger}
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? '삭제 중...' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomDetailSection;