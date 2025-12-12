import styles from "./SnapshotItem.module.css";
import { formatDate } from "../../../../../utils/date";
export default function SnapshotItem({ snapshot,onClick ,lang}) {

  // 추후 테이블에 language 생성시 컴포넌트 전달
  console.log(lang);
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.title}>
        {snapshot.title}
        <div className={styles.lang}>
          JAVA
        </div>
      </div>
      <div className={styles.meta}>
        {formatDate(snapshot.createdAt)}
      </div>
    </div>
  );
}
