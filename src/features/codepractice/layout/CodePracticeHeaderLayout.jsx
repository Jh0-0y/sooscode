import {
  ChevronLeft,
  PanelLeftOpen, PanelLeftClose,
  PanelRightOpen, PanelRightClose
} from "lucide-react";

import { usePracticeUIStore } from "@/features/codepractice/store/usePracticeUIStore";
import { usePracticeStore } from "@/features/codepractice/store/usePracticeStore";
import styles from "./CodePracticeHeader.module.css";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useState } from "react";

export default function CodePracticeHeaderLayout({
  classTitle = "코드 연습",
  onSave,
  onRun,
  onChangeLang,
  defaultLang = "python"
}) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const run = usePracticeStore((s) => s.run);

  const {
    isSidebarOpen,
    toggleSidebar,
    isSnapshotOpen,
    toggleSnapshot
  } = usePracticeUIStore();

  const [selectedLang, setSelectedLang] = useState(defaultLang);

  const handleLangToggle = () => {
    const next = selectedLang === "java" ? "python" : "java";
    setSelectedLang(next);
    onChangeLang && onChangeLang(next);
  };


  return (
    <header className={styles.wrapper}>
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span className={styles.title}>{classTitle}</span>
      </div>

      <div className={styles.right}>
        <button className={styles.actionBtn} onClick={toggleSidebar}>
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          사이드바
        </button>

        <button className={styles.actionBtn} onClick={toggleSnapshot}>
          {isSnapshotOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          스냅샷
        </button>

        <button className={styles.actionBtn} onClick={onSave}>저장</button>
        <button className={`${styles.actionBtn} ${styles.runBtn}`} onClick={run}>
          실행
        </button>
        <button className={styles.actionBtn} onClick={handleLangToggle}>
          {selectedLang.toUpperCase()}
        </button>
        <button onClick={toggleDarkMode}>
            {darkMode ? "🌙 다크모드" : "☀️ 라이트모드"}
        </button>
      </div>
    </header>
  );
}
