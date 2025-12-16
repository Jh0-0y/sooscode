// components/Skeleton/Skeleton.jsx
import React from 'react';
import styles from './Skeleton.module.css';

/**
 * 기본 스켈레톤 컴포넌트
 */
export const Skeleton = ({
                             width = '100%',
                             height = '20px',
                             borderRadius = '4px',
                             className = ''
                         }) => {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
};

/**
 * 텍스트 스켈레톤
 */
export const SkeletonText = ({ lines = 1, width = '100%' }) => {
    return (
        <div className={styles.skeletonTextContainer}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    width={index === lines - 1 ? '80%' : width}
                    height="16px"
                />
            ))}
        </div>
    );
};

/**
 * 테이블 행 스켈레톤
 */
export const SkeletonTableRow = ({ columns = 4 }) => {
    return (
        <tr className={styles.skeletonTableRow}>
            {Array.from({ length: columns }).map((_, index) => (
                <td key={index}>
                    <Skeleton height="16px" />
                </td>
            ))}
        </tr>
    );
};

/**
 * 카드 스켈레톤
 */
export const SkeletonCard = () => {
    return (
        <div className={styles.skeletonCard}>
            <Skeleton height="120px" borderRadius="8px 8px 0 0" />
            <div className={styles.skeletonCardContent}>
                <Skeleton height="24px" width="60%" />
                <Skeleton height="16px" width="100%" />
                <Skeleton height="16px" width="80%" />
            </div>
        </div>
    );
};