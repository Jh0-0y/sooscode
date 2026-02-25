import styles from "./EditModal.module.css";

export default function EditModal({
  title = "이름 수정",
  value,
  onChange,
  onClose,
  onSave,
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>{title}</h3>

        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />

        <div className={styles.buttonBox}>
          <button className={styles.cancel} onClick={onClose}>
            취소
          </button>
          <button className={styles.save} onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
