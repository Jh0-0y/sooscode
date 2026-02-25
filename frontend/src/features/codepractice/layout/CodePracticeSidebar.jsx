import CodePracticeSidebarHeader from "../components/CodePracticeSidebarHeader";
import AIPanel from "../components/sidebarpanels/AIPanel";
import SnapshotPanel from "../components/sidebarpanels/SnapshotPanel";
import SnippetPanel from "../components/sidebarpanels/SnippetPanel";
import TestPanel from "../components/sidebarpanels/TestPanel";
import { useResizableWidth } from "../hooks/useResizableWidth";

import { useSidebarStore } from "../store/useSidebarStore";
import styles from "./CodePracticeSidebar.module.css";
export default function CodePracticeSidebar() {

  // activeTab , sidebar width, resizing , 마우스좌표, 드래그시작당시 width 상태값 저장
  const activeTab = useSidebarStore((s) => s.activeTab);


  const { width, onResizeMouseDown } = useResizableWidth({
      initialWidth: 240,
      minWidth: 200,
      maxWidth: 600,
    });



  return (
    <div className={styles.sidebarWrapper}
        style={{width}}
      >
      <div
        className={styles.resizeHandle}
        onMouseDown={onResizeMouseDown}
      />

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
