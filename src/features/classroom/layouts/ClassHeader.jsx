// common/components/classroom/ClassHeader.jsx
import { SettingIcon, UserIcon } from '@/common/components/utils/Icons';
import styles from './ClassHeader.module.css';

const ClassHeader = ({ 
    className, 
    status = 'live',
    participantCount,
    totalParticipants,
    onOpenSettings
}) => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className="logo" />
                <h1 className={styles.className}>{className}</h1>
                <span className={`${styles.badge} ${styles[status]}`}>
                    {status === 'live' ? '진행중' : '종료'}
                </span>
                {participantCount !== undefined && (
                    <span className={styles.participantCount}>
                        <UserIcon /> {participantCount}/{totalParticipants}명
                    </span>
                )}
            </div>
            <div className={styles.right}>
                <button className={styles.settingButton} onClick={onOpenSettings}>
                    <SettingIcon />
                    설정
                </button>
            </div>
        </header>
    );
};

export default ClassHeader;
