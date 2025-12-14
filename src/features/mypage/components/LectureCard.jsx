import { useNavigate } from "react-router-dom";
import styles from "./LectureCard.module.css";
import defaultImg from "@/assets/img1.jpg";

export default function LectureCard({ 
  thumbnail,
  title,
  teacher,
  onClick,
  isOnAir = false,
  classId,   
}) {

  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img
          className={styles.thumbnail}
          src={thumbnail || defaultImg}
          alt={title}
          onClick={() => navigate("/class")}
        />

        <div className={styles.overlay}>
          <span className={styles.enterText}>강의실 입장</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title || "React 기초강의"}</h3>
        <p className={styles.teacher}>{teacher || "김철수"}</p>
      </div>

      <div className={styles.buttonBox}>
        <button className={styles.detailButton} onClick={onClick}>강의 상세 페이지 이동</button>
      </div>
    </div>
  );
}
