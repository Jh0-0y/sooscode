// common/components/classroom/ClassHeader.jsx
import { SettingIcon, BroadcastIcon, CameraIcon, UserIcon } from '@/common/components/Icons';
import styles from './ClassHeader.module.css';

const ClassHeader = ({ 
    className, 
    status = 'live',
    participantCount,
    totalParticipants,
    isInstructor = false,
    onBroadcast,
    onSaveSnapshot,
    onOpenSettings
}) => {
    return (
        <header className={styles.container}>
            <div className={styles.left}>
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
                {isInstructor && (
                    <>
                        <button className={styles.broadcastButton} onClick={onBroadcast}>
                            <BroadcastIcon />
                            코드 전송
                        </button>
                        <button className={styles.snapshotButton} onClick={onSaveSnapshot}>
                            <CameraIcon />
                            스냅샷 저장
                        </button>
                    </>
                )}
                <button className={styles.settingButton} onClick={onOpenSettings}>
                    <SettingIcon />
                    설정
                </button>
            </div>
        </header>
    );
};

export default ClassHeader;
