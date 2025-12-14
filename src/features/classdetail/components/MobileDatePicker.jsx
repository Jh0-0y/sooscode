import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./MobileDatePicker.module.css";
import { useState } from "react";

export default function MobileDatePicker({ dates, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  const handleChange = (date) => {
    const raw = date.toISOString().split("T")[0];
    onSelect(raw);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} onClick={() => setOpen(true)}>
      <div className={styles.label}>
        {selected || "날짜 선택"}
      </div>

      {open && (
        <div
          className={styles.picker}
          onClick={(e) => e.stopPropagation()} // 🔥 picker 클릭 시 닫히는 거 방지
        >
          <DatePicker
            inline
            selected={new Date(selected)}
            onChange={handleChange}
            minDate={new Date(dates[0].raw)}
            maxDate={new Date(dates[dates.length - 1].raw)}
          />
          <button
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
