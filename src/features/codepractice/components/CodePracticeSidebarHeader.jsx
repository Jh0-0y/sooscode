import { useSidebarStore } from '../store/useSidebarStore';
import styles from './CodePracticeSidebarHeader.module.css';

export default function CodePracticeSidebarHeader() {
  const { activeTab, setActiveTab } = useSidebarStore();

  return (
    <div className={styles.sidebarHeader}>
      <button
        className={`${styles.tab} ${activeTab === "snapshot" ? styles.active : ""}`}
        onClick={() => setActiveTab("snapshot")}
      >
        Snapshot
      </button>

      <button
        className={`${styles.tab} ${activeTab === "snippet" ? styles.active : ""}`}
        onClick={() => setActiveTab("snippet")}
      >
        Snippet
      </button>

      <button
        className={`${styles.tab} ${activeTab === "test" ? styles.active : ""}`}
        onClick={() => setActiveTab("test")}
      >
        Test
      </button>

      <button
        className={`${styles.tab} ${activeTab === "ai" ? styles.active : ""}`}
        onClick={() => setActiveTab("ai")}
      >
        AI
      </button>
    </div>
  );
}
