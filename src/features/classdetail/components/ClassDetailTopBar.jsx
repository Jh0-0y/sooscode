import { useNavigate } from "react-router-dom";
import styles from "./ClassDetailTopBar.module.css";
import { FaCode } from "react-icons/fa";

export default function ClassDetailTopBar({title,online,classId}) {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        
      </div>

      <div className={styles.center}>
        <div className={styles.textBox}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{online ? "온라인 강의" : "오프라인 강의"}</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.buttonContainer}>
          <button className={styles.enterBtn} onClick={() => navigate('/class')}>입장하기</button>
          <button className={styles.practiceBtn} onClick={() => navigate(`/classdetail/codepractice/${classId}`)}>코드연습</button>
        </div>
        
      </div>
    </div>
  );
}
