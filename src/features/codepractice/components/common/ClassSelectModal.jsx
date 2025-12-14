import { getMyClasses } from "../../services/class/mypageClass.api";
import styles from "./ClassSelectModal.module.css";
import { useEffect, useState } from "react";

export default function ClassSelectModal({ onSelect, onClose }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getMyClasses();
        setClasses(res || []);
      } catch (e) {
        console.error("강의 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>강의 선택</h2>

        {loading && <p className={styles.empty}>불러오는 중…</p>}

        {!loading && classes.length === 0 && (
          <p className={styles.empty}>선택 가능한 강의가 없습니다.</p>
        )}

        {!loading && classes.length > 0 && (
          <ul className={styles.list}>
            {classes.map((cls) => (
              <li
                key={cls.classId}
                className={styles.item}
                onClick={() => onSelect(cls)}
              >
                {cls.title}
              </li>
            ))}
          </ul>
        )}

        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
