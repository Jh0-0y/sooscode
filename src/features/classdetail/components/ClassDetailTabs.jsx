import styles from "./ClassDetailTabs.module.css";

export default function ClassDetailTabs({ activeTab, onChange }) {

  console.log("activeTab : " , activeTab);
  console.log("styles:", styles);

  return (
    <div className={styles.tabContainer}>
      <div
        className={`${styles.tab} ${activeTab === "notice" ? styles.active : ""}`}
        onClick={() => onChange("notice")}
      >
        공지사항
      </div>

      <div
        className={`${styles.tab} ${activeTab === "snapshot" ? styles.active : ""}`}
        onClick={() => onChange("snapshot")}
      >
        코드 스냅샷
      </div>

      <div
        className={`${styles.tab} ${activeTab === "files" ? styles.active : ""}`}
        onClick={() => onChange("files")}
      >
        자료실
      </div>
    </div>
  );
}
