import {
  ChevronLeft,
  PanelLeftOpen, PanelLeftClose,
  PanelRightOpen, PanelRightClose
} from "lucide-react";

import { usePracticeUIStore } from "@/features/codepractice/store/usePracticeUIStore";
import { usePracticeStore } from "@/features/codepractice/store/usePracticeStore";
import styles from "./CodePracticeHeaderLayout.module.css";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useEffect, useState } from "react";
import { DEFAULT_SNIPPETS } from "../constants/defaultSnippets";

export default function CodePracticeHeaderLayout({
  classTitle = "Java Fullstack 12기",
  onSave,
  //onRun,
  onChangeLang,
  defaultLang = "python"
}) {

  // navigate , darkmode , run , sidebar 상태관리 
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const run = usePracticeStore((s) => s.run);
  const resetCode = usePracticeStore((s) => s.resetCode);
  const setCode = usePracticeStore((s) => s.setCode);
  const {
    isSidebarOpen,
    toggleSidebar,
    isSnapshotOpen,
    toggleSnapshot
  } = usePracticeUIStore();

  // default code language
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const setLanguage = usePracticeStore((s) => s.setLanguage);

  // Language 선택 후 default Code 변경 logic
  const handleLangToggle = () => {
    //const next = selectedLang === "java" ? "python" : "java";
    
    let next;  // ← const 말고 let로 선언해야 함

    if (selectedLang === "python") next = "java";
    else if (selectedLang === "java") next = "hcj";
    else next = "python";
    
    setSelectedLang(next);
    setLanguage(next);

    const defaultCode = DEFAULT_SNIPPETS[next];
    if (defaultCode) setCode(defaultCode);
    onChangeLang && onChangeLang(next);

    console.log("selected Lang:", next);
  };
  
  // Ctrl + 3 입력시 컴파일 기능
  useEffect(() => {
    const hadleKeydown = (e) => {
      if(e.ctrlKey && e.key === "3"){
        e.preventDefault();
        run();
      }
    }
    // window 전체에 addEventListener 선언
    window.addEventListener("keydown", hadleKeydown);
    // 컴포넌트가 사라질때 이벤트 리스너 제거 ( 반복 렌더링 예방 )
    return () => window.removeEventListener("keydown", hadleKeydown);
  }, [run]);


  return (
    <header className={styles.wrapper}>
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span className={styles.title}>
          코드 연습
        </span>
        <div className={styles.classTitle}>
          {classTitle}
        </div>
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
        <button className={`${styles.actionBtn} ${styles.runBtn}`} onClick={resetCode}>
          초기화
        </button>
        <button className={styles.actionBtn} onClick={handleLangToggle}>
          {selectedLang.toUpperCase()}
        </button>
        <button onClick={toggleDarkMode} className={styles.actionBtn}>
            {darkMode ? "🌙 다크모드" : "☀️ 라이트모드"}
        </button>
      </div>
    </header>
  );
}
