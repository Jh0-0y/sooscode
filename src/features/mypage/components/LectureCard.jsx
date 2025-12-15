import { useNavigate } from "react-router-dom";
import styles from "./LectureCard.module.css";
import defaultImg from "@/assets/img1.jpg";
import { encode } from '@/utils/urlEncoder';

export default function LectureCard({ 
  thumbnail,
  title,
  teacher,
  onClick,
  isOnAir = false,
  classId,   
}) {

  const navigate = useNavigate();

  const handleJoinClass = (classId) => {
        const encoded = encode(classId);
        navigate(`/class/${encoded}`);  // ← /class/MTIz
    };


  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img
          className={styles.thumbnail}
          src={thumbnail || defaultImg}
          alt={title}
          onClick={() => {
            // 1. classId는 반드시 props로 내려와 있어야 함
            // 2. encode는 "객체"를 받는 규칙임
            handleJoinClass(classId)}
          }
        />

        <div className={styles.overlay}>
          <span className={styles.enterText}>강의실 입장</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.teacher}>{teacher}</p>
      </div>

      <div className={styles.buttonBox}>
        <button className={styles.detailButton} onClick={onClick}>강의 상세 페이지 이동</button>
      </div>
    </div>
  );
}
