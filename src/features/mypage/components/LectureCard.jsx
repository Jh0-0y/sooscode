import { useNavigate } from "react-router-dom";
import styles from "./LectureCard.module.css";
import defaultImg from "@/assets/img1.jpg";
import { encode } from "@/utils/urlEncoder";

export default function LectureCard({
  thumbnail,
  title,
  teacher,
  onClick,
  isOnAir = false,
  classId,
  imageUrl,
}) {
  const navigate = useNavigate();

  const handleJoinClass = (classId) => {
    const encoded = encode(classId);
    console.log("encoded:", encoded);
  console.log("current:", window.location.pathname);
    navigate(`/class/${encoded}`); // ← /class/MTIz
  };

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img
          className={styles.thumbnail}
          src={imageUrl || defaultImg}
          alt={title}
          onClick={() => {
            if (!isOnAir) {
              // TODO: 나중에 토스트 메시지 추가
              // toast("강의 시간이 아닙니다");
              return;
            }
            handleJoinClass(classId);
          }}
        />

        {/* ON AIR 상태 뱃지 */}
        {isOnAir && (
          <div className={styles.liveBadge}>
            ON AIR
          </div>
        )}

        {/* hover 시 안내 문구 */}
        <div className={styles.overlay}>
          <span className={styles.enterText}>
            {isOnAir ? "강의실 입장" : "강의 시간 아님"}
          </span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.teacher}>{teacher}</p>
      </div>

      <div className={styles.buttonBox}>
        <button
          className={styles.detailButton}
          onClick={onClick}
        >
          강의 상세 페이지 이동
        </button>
      </div>
    </div>
  );
}
