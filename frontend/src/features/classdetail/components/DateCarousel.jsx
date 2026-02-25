import { useRef } from "react";
import styles from "./DateCarousel.module.css";

export default function DateCarousel({ dates, selected, onSelect }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.arrow} onClick={scrollLeft}>
        ‹
      </button>
      <div className={styles.list} ref={scrollRef}>
        {dates.map((d) => (
          <div
            key={d.date}
            className={`${styles.item} ${
              selected === d.date ? styles.active : ""
            }`}
            onClick={() => onSelect(d.date)}
          >
            <div className={styles.dayText}>{d.label}</div>
            <div className={styles.weekday}>{d.weekday}</div>
          </div>
        ))}
      </div>
      <button className={styles.arrow} onClick={scrollRight}>
        ›
      </button>
    </div>
  );
}
