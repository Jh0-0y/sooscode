import { useNavigate } from "react-router-dom";
import styles from "./LectureCard.module.css";
import defaultImg from "@/assets/img1.jpg";
import { encode } from "@/utils/urlEncoder";
import { formatDate, formatTime } from "../../../utils/date";

export default function LectureCard({
  title,
  teacher,
  isOnAir = false,
  classId,
  imageUrl,
  startDate,
  endDate,
  startTime,
  endTime,
}) {
  const navigate = useNavigate();

  const handleJoinClass = (classId) => {
    const encoded = encode(classId);
    console.log("encoded:", encoded);
    console.log("current:", window.location.pathname);
    navigate(`/class/${encoded}`);
  };

  return (
    <div className={styles.card}>
      <div
        className={styles.thumbnailWrapper}
      >
        <img
          className={styles.thumbnail}
          src={imageUrl || defaultImg}
          alt={title}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.teacher}>{teacher}</p>
        <p className={styles.period}>
          강의기간 {formatDate(startDate)} ~ {formatDate(endDate)}
        </p>

        {/* ✅ 강의 시간 */}
        <p className={styles.time}>
          강의시간 {formatTime(startTime)} ~ {formatTime(endTime)}
        </p>
      </div>

      <div className={styles.buttonBox}>
        <button
          className={`${styles.detailButton} ${
            !isOnAir ? styles.disabledButton : ""
          }`}
          disabled={!isOnAir}
          onClick={() => {
            if (!isOnAir) return;
            handleJoinClass(classId);
          }}
        >
          강의실 입장
        </button>
      </div>
    </div>
  );
}
