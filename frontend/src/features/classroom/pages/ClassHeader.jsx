import { SettingIcon, UserIcon } from '@/common/components/utils/Icons';
import { useClassroomContext } from '@/features/classroom/contexts/ClassroomContext';
import styles from './ClassHeader.module.css';

const ClassHeader = ({ onOpenSettings }) => {
    const { className, status, isInstructor, totalParticipantCount } = useClassroomContext();

    // TODO: 참가자 수는 추후 API 또는 소켓으로 실시간 업데이트 @박수빈
    const participantCount = 1;

    // status를 헤더 표시용으로 변환
    const displayStatus = status === 'ONGOING' ? 'live' : 'ended';

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className="logo" />
                <h1 className={styles.className}>{className}</h1>
                <span className={`${styles.badge} ${styles[displayStatus]}`}>
                    {displayStatus === 'live' ? '진행중' : '종료'}
                </span>
                <span className={styles.participantCount}>
                    <UserIcon /> {participantCount}/{totalParticipantCount}명
                </span>
            </div>
            {isInstructor && (
                <div className={styles.right}>
                    <button className={styles.settingButton} onClick={onOpenSettings}>
                        <SettingIcon />
                        설정
                    </button>
                </div>
            )}
        </header>
    );
};

export default ClassHeader;