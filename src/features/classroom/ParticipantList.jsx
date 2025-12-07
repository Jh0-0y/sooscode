// common/components/classroom/ParticipantList.jsx
import styles from './ParticipantList.module.css';

const ParticipantList = ({ participants, selectedId, onSelect }) => {
    return (
        <div className={styles.container}>
            {participants.map((participant) => (
                <button
                    key={participant.id}
                    className={`${styles.item} ${selectedId === participant.id ? styles.active : ''}`}
                    onClick={() => onSelect(participant)}
                >
                    <span className={`${styles.statusDot} ${styles[participant.status]}`} />
                    <span className={styles.name}>{participant.name}</span>
                    <span className={styles.viewButton}>코드 보기</span>
                </button>
            ))}
        </div>
    );
};

export default ParticipantList;
