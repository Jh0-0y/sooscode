import styles from "./CodePracticePage.module.css";
import CodePracticeSidebar from "@/features/codepractice/layout/CodePracticeSidebar";
import CodePracticeSection from "@/features/codepractice/layout/CodePracticeSection";
import { usePracticeUIStore } from "../../features/codepractice/store/usePracticeUIStore";
import { usePracticeStore } from "../../features/codepractice/store/usePracticeStore";
import CodePracticeHeaderLayout from "@/features/codepractice/layout/CodePracticeHeaderLayout.jsx";
import { useEffect, useState } from "react";
import { loadPyodideInstance } from "../../features/codepractice/utils/PyodideLoader";
import { useLoading } from "../../hooks/useLoading";
import HCJPracticeSection from "../../features/codepractice/layout/HCJPracticeSection";
import ClassSelectModal from "../../features/codepractice/components/common/ClassSelectModal";

export default function CodePracticePage() {

  const { isSidebarOpen } = usePracticeUIStore();
  const language = usePracticeStore((s) => s.language);  // 언어 상태 가져오기
  const { showLoading, hideLoading } = useLoading();
  const { htmlCode, cssCode, jsCode, setHTML, setCSS, setJS } = usePracticeStore();
  const { classTitle , classId, setClassId, setClassTitle } = usePracticeStore();
  const [ isClassSelectOpen, setIsClassSelectOpen ] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        showLoading();

        console.log("Code Practice Page Loading");
        await loadPyodideInstance(); 

        console.log("Pyodide Loading Success");
      } catch (err) {
        console.error("Pyodide init error:", err);
      } finally {
        hideLoading();
      }
    };
    init();
  }, []);
  
  return (
    <div className={styles.PageWrapper}>
      <CodePracticeHeaderLayout
        classTitle={classTitle || "강의 선택"}
        onClickClassSelect={() => setIsClassSelectOpen(true)}
      />

      <div className={styles.ContentWrapper}>
        <div className={styles.sidebar}>
          {isSidebarOpen && <CodePracticeSidebar />}
        </div>
        {language === "CSS_HTML_JS" ? (
          <HCJPracticeSection
            HTMLCode={htmlCode}
            CSSCode={cssCode}
            JSCode={jsCode}
            onHTMLChange={setHTML}
            onCSSChange={setCSS}
            onJSChange={setJS}
          />
        ) : (
          <CodePracticeSection />
        )}
      </div>

      {isClassSelectOpen && (
        <ClassSelectModal
          onSelect={(cls) => {
            console.log("class select : ", cls);
            setClassId(cls.classId);
            setClassTitle(cls.title);
            setIsClassSelectOpen(false);
          }}
          onClose={() => setIsClassSelectOpen(false)}
        />
      )}
    </div>
  );
}
