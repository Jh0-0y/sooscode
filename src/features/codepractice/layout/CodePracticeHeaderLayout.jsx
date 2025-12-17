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
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SNIPPETS } from "../constants/defaultSnippets";
import { useSnapshotStore } from "../store/useSnapshotStore";
import { buildHCJ } from "../utils/parseHCJ";

// CopePractice의 Header 레이아웃
export default function CodePracticeHeaderLayout({
  onChangeLang,
  defaultLang = "JAVA",
  onClickClassSelect,
}) {

  // navigate , darkmode , run , sidebar 상태관리 
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const run = usePracticeStore((s) => s.run);
  const resetCode = usePracticeStore((s) => s.resetCode);
  const setCode = usePracticeStore((s) => s.setCode);
  const {isSidebarOpen, toggleSidebar, isSnapshotOpen, toggleSnapshot, toggleHCJSnapshot,} = usePracticeUIStore();
  const saveHCJSnapshot = useSnapshotStore((s) => s.saveHCJSnapshot);
  const language = usePracticeStore((s) => s.language);
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const setLanguage = usePracticeStore((s) => s.setLanguage);
  const triggerRefresh = useSnapshotStore((s) => s.triggerRefresh);
  const loadHCJSnapshot = useSnapshotStore((s) => s.loadSelectedHCJSnapshot);
  const isRunning = usePracticeStore((s) => s.isRunning);

  //store의 classTitle , classId subscribe
  const classTitle = usePracticeStore((s) => s.classTitle);
  const classId = usePracticeStore((s) => s.classId);
//   const resetHCJToDefault = usePracticeStore(
//   (s) => s.resetHCJToDefault
// );

  // Language 선택 후 default Code 변경 logic 및 Header Handling
  const handleLangToggle = () => {
    let next;

    if (selectedLang === "JAVA") next = "PYTHON";
    else if (selectedLang === "PYTHON") next = "CSS_HTML_JS";
    else next = "JAVA";
        
    setSelectedLang(next);
    setLanguage(next);
    useSnapshotStore.getState().resetSnapshots();
    triggerRefresh();
    const defaultCode = DEFAULT_SNIPPETS[next];
    if (defaultCode) setCode(defaultCode);
    onChangeLang && onChangeLang(next);

    console.log("selected Lang:", next);
    if (next === "CSS_HTML_JS") {
    //resetHCJToDefault(); // 안먹음
    
    } else {
      setCode(DEFAULT_SNIPPETS[next]);
    }
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

  // 새창에서 열기
  const previewWindowRef = useRef(null);
  const htmlCode = usePracticeStore((s) => s.htmlCode);
  const cssCode  = usePracticeStore((s) => s.cssCode);
  const jsCode   = usePracticeStore((s) => s.jsCode);
  const openHCJInNewWindow = async () => {
  const fullHTML = buildHCJ({
    html: htmlCode,
    css: cssCode,
    js: jsCode,
  });
  await run();

  if (!previewWindowRef.current || previewWindowRef.current.closed) {
    previewWindowRef.current = window.open(
      "about:blank",
      "HCJ_PREVIEW",
      "width=1200,height=800,resizable=yes,scrollbars=yes"
    );
  }

  const win = previewWindowRef.current;
  if (!win) return;

  win.document.open();
  win.document.write(fullHTML);
  win.document.close();
  win.focus();
  };



  return (
    <header className={styles.wrapper}>
      
      <div className={styles.left}>
        
        <button className={styles.backBtn} onClick={() => navigate("/mypage")}>
          <ChevronLeft size={20} />
        </button>
        <span className={styles.title}>
          코드 연습
        </span>
        <div className={styles.classTitle} onClick={onClickClassSelect}>
          {classTitle}
        </div>
      </div>

      <div className={styles.right}>
        <button className={`${styles.actionBtn} ${styles.runBtn}`} 
          onClick={run}
          disabled={isRunning}
        >
          {isRunning ? "실행 중..." : "실행"}
        </button>
        <button className={`${styles.actionBtn} ${styles.runBtn}`} onClick={resetCode}>
          초기화
        </button>
        
        <button className={`${styles.actionBtn} ${styles.sidebarBtn}`} onClick={toggleSidebar}>
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          사이드바
        </button>

        <button className={`${styles.actionBtn} ${styles.snapshotBtn}`}
         onClick={() => {
            if (language === "CSS_HTML_JS") {
              toggleHCJSnapshot();
            } else {
              toggleSnapshot();
            }
          }}
                  
         
         >
          {isSnapshotOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          스냅샷
        </button>
        
        {language === "CSS_HTML_JS" && (
          <>
            {
            
             <button
  className={`${styles.actionBtn} ${styles.runBtn} ${styles.hcjBtn}`}
  onClick={async () => {
    const title = window.prompt("스냅샷 이름을 입력하세요");
    if (!title) {
      alert("제목을 입력해주세요");
      return;
    }
    if (!classId) {
      alert("클래스를 선택해주세요");
      return;
    }

    console.log("hcj 저장 시작")
    await saveHCJSnapshot(title);
    
    console.log("hcj 저장 완료")
  }}
>
  저장
</button>

            
            

            
            }
              <button
              className={`${styles.actionBtn} ${styles.runBtn} ${styles.hcjBtn}`}
              onClick={openHCJInNewWindow}
            >
              새 창에서 실행
            </button>
          </>
        )}
        
        <button className={styles.actionBtn} onClick={handleLangToggle}>
          {selectedLang}
        </button>
        <button onClick={toggleDarkMode} className={`${styles.actionBtn} ${styles.darkmodeBtn}`}>
            {darkMode ? "🌙 다크모드" : "☀️ 라이트모드"}
        </button>
      </div>
    </header>
  );
}
