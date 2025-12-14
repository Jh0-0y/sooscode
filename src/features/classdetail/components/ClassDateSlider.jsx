import { useEffect, useState } from "react";
import styles from "./ClassDateSlider.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClassDateSlider({ dates, selected, onSelect }) {
  const [startIndex, setStartIndex] = useState(0);
  const [openPicker, setOpenPicker] = useState(false);
  
  const visibleDates = dates.slice(startIndex, startIndex + 7);

  const goPrev = () => {
    setStartIndex((prev) => Math.max(prev - 7, 0));
  };

  const goNext = () => {
    setStartIndex((prev) =>
      prev + 7 >= dates.length ? prev : prev + 7
    );
  };
  
  const handleSelectDate = (dateObj) => {
    const raw = dateObj.toISOString().split("T")[0];
    const idx = dates.findIndex((d) => d.raw === raw);

    if (idx !== -1) {
      const pageStart = Math.floor(idx / 7) * 7;
      setStartIndex(pageStart);
      onSelect(raw);
    }

    setOpenPicker(false);
  };

  useEffect(() => {
    if (!dates.length) return;

    const today = new Date().toISOString().split("T")[0];
    const idx = dates.findIndex(d => d.raw === today);

    if (idx !== -1) {
      const pageStart = Math.floor(idx / 7) * 7;
      setStartIndex(pageStart);
      onSelect(today);
    }
  }, []); // ✅ 처음 마운트 시 1회
  

  return (
  <div className={styles.container}>

    {/* 날짜 선택 버튼을 위로 올린다 */}
    <div className={styles.topArea}>
      <button className={styles.pickButton} onClick={() => setOpenPicker(true)}>
        날짜 선택
      </button>

      {openPicker && (
        <div className={styles.pickerWrapper}>
          <DatePicker
            inline
            selected={new Date(selected)}
            onChange={handleSelectDate}
            minDate={new Date(dates[0].raw)}
            maxDate={new Date(dates[dates.length - 1].raw)}
          />
          <button className={styles.closeBtn} onClick={() => setOpenPicker(false)}>
            닫기
          </button>
        </div>
      )}
    </div>

    {/* 아래는 기존 슬라이더 디자인 그대로 */}
    <div className={styles.wrapper}>
      <button className={styles.arrow} onClick={goPrev}>
        <FaChevronLeft />
      </button>

      <div className={styles.list}>
        {visibleDates.map((d) => (
          <div
            key={d.raw}
            className={`${styles.item} ${selected === d.raw ? styles.active : ""}`}
            onClick={() => onSelect(d.raw)}
          >
            <div className={styles.date}>{d.label}</div>
            <div className={styles.weekday}>{d.weekday}</div>
          </div>
        ))}
      </div>

      <button className={styles.arrow} onClick={goNext}>
        <FaChevronRight />
      </button>
    </div>

  </div>
);

}
