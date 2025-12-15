import React from 'react';
import styles from './UserClassCard.module.css';

const UserClassCard = ({ classes, onClassClick }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>수강 클래스</h2>
                <span className={styles.classCount}>{classes.length}개</span>
            </div>
            <div className={styles.cardBody}>
                {classes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <p>수강 중인 클래스가 없습니다</p>
                    </div>
                ) : (
                    <div className={styles.classList}>
                        {classes.map(cls => (
                            <div
                                key={cls.id}
                                className={styles.classItem}
                                onClick={() => onClassClick(cls.id)}
                            >
                                <div className={styles.classInfo}>
                                    <h3 className={styles.classTitle}>{cls.title}</h3>
                                    <p className={styles.classInstructor}>강사: {cls.instructor}</p>
                                </div>
                                <div className={styles.classProgress}>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${cls.progress}%` }}
                                        />
                                    </div>
                                    <span className={styles.progressText}>{cls.progress}%</span>
                                </div>
                                <div className={styles.classFooter}>
                                    <span className={styles.enrolledDate}>등록일: {cls.enrolledAt}</span>
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