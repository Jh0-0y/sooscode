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
        강의소개
      </div>
    </div>
  );
}
