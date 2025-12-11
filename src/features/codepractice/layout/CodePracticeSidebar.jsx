import CodePracticeSidebarHeader from "../components/CodePracticeSidebarHeader";
import AIPanel from "../components/sidebarpanels/AIPanel";
import SnapshotPanel from "../components/sidebarpanels/SnapshotPanel";
import SnippetPanel from "../components/sidebarpanels/SnippetPanel";
import TestPanel from "../components/sidebarpanels/TestPanel";

import { useSidebarStore } from "../store/useSidebarStore";
import styles from "./CodePracticeSidebar.module.css";

export default function CodePracticeSidebar() {

  const activeTab = useSidebarStore((s) => s.activeTab);

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.headerContainer}>
        <CodePracticeSidebarHeader />
      </div>

      <div className={styles.contentContainer}>
        {activeTab === "snapshot" && <SnapshotPanel />}
        {activeTab === "snippet" && <SnippetPanel />}
        {activeTab === "test" && <TestPanel />}
        {activeTab === "ai" && <AIPanel />}
      </div>
    </div>
  );
}
