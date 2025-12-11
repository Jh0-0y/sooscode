import { useSidebarStore } from "../store/useSidebarStore";
import SnapshotPanel from "./panels/SnapshotPanel";
import SnippetPanel from "./panels/SnippetPanel";
import TestPanel from "./panels/TestPanel";
import AIPanel from "./panels/AIPanel";
import styles from "./CodePracticeSidebarContent.module.css";

export default function CodePracticeSidebarContent() {
  const activeTab = useSidebarStore((s) => s.activeTab);

  return (
    <div className={styles.sidebarContent}>
      {activeTab === "snapshot" && <SnapshotPanel />}
      {activeTab === "snippet" && <SnippetPanel />}
      {activeTab === "test" && <TestPanel />}
      {activeTab === "ai" && <AIPanel />}
    </div>
  );
}
