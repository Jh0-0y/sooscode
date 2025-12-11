import styles from "./CodePracticePage.module.css";
import CodePracticeSidebar from "@/features/codepractice/layout/CodePracticeSidebar";
import CodePracticeSection from "@/features/codepractice/layout/CodePracticeSection";
import { usePracticeUIStore } from "../../features/codepractice/store/usePracticeUIStore";
import CodePracticeHeaderLayout from "@/features/codepractice/layout/CodePracticeHeaderLayout.jsx";
import { useEffect } from "react";
import { loadPyodideInstance } from "../../features/codepractice/utils/PyodideLoader";
import { useLoading } from "../../hooks/useLoading";

export default function CodePracticePage() {
  const { isSidebarOpen } = usePracticeUIStore();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const init = async () => {
      try {
        showLoading();  // 1) 페이지 입장 → 로딩 켜기

        console.log("Code Practice Page Loading");
        await loadPyodideInstance(); // 2) Pyodide 로딩 기다리기

        console.log("Pyodide Loading Success");
      } catch (err) {
        console.error("Pyodide init error:", err);
      } finally {
        hideLoading();  // 3) 로딩 끄기
      }
    };

    init();
  }, []);

  return (
    <div className={styles.PageWrapper}>
      <CodePracticeHeaderLayout />
      <div className={styles.ContentWrapper}>
        {isSidebarOpen && <CodePracticeSidebar />}
        <CodePracticeSection />
      </div>
    </div>
  );
}
