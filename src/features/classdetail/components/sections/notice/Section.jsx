import styles from "./Section.module.css";

export default function Section({ classInfo }) {
  return (
    <div className={styles.body}>
      <div className={styles.infoCard}>
        {classInfo.title}
      </div>

      <div className={styles.infoCard}>
        <div className={styles.schedule}>
          <div>
            <strong>기간</strong>
            <span>{classInfo.startDate} ~ {classInfo.endDate}</span>
          </div>
          <div>
            <strong>시간</strong>
            <span>
              {classInfo.startTime.slice(0,5)} - {classInfo.endTime.slice(0,5)}
            </span>
          </div>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.badge}>{classInfo.status}</span>
          <span className={styles.badgeSecondary}>{classInfo.mode}</span>
        </div>
      </div>


      <div className={styles.infoCard}>
        <p className={styles.description}>
          {classInfo.description}
        </p>

        

        
      </div>

      <div className={styles.noticeBox}>
        등록된 공지사항이 없습니다.
      </div>
    </div>
  );
}
