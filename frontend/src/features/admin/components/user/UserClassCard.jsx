import React from 'react';
import styles from './UserClassCard.module.css';

const UserClassCard = ({ classes, onClassClick }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.headerContent}>
                    <h2 className={styles.cardTitle}>수강 클래스</h2>
                    <span className={styles.classCount}>{classes.length}</span>
                </div>
            </div>
            <div className={styles.cardBody}>
                {classes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <p className={styles.emptyText}>수강 중인 클래스가 없습니다</p>
                        <p className={styles.emptySubtext}>새로운 클래스를 등록해보세요</p>
                    </div>
                ) : (
                    <div className={styles.classList}>
                        {classes.map((cls, index) => (
                            <div
                                key={cls.id}
                                className={styles.classItem}
                                onClick={() => onClassClick(cls.id)}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={styles.classHeader}>
                                    <div className={styles.classIconWrapper}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                        </svg>
                                    </div>
                                    <div className={styles.classInfo}>
                                        <h3 className={styles.classTitle}>{cls.title}</h3>
                                        <p className={styles.classInstructor}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                            {cls.instructor}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.classProgress}>
                                    <div className={styles.progressHeader}>
                                        <span className={styles.progressLabel}>진행률</span>
                                        <span className={styles.progressText}>{cls.progress}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${cls.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.classFooter}>
                                    <div className={styles.enrolledInfo}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span className={styles.enrolledDate}>{cls.enrolledAt}</span>
                                    </div>
                                    <svg className={styles.arrowIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserClassCard;