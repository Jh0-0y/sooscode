import styles from "./CodePracticePage.module.css";
import CodePracticeSidebar from "@/features/codepractice/layout/CodePracticeSidebar";
import CodePracticeSection from "@/features/codepractice/layout/CodePracticeSection";
import { usePracticeUIStore } from "../../features/codepractice/store/usePracticeUIStore";
import CodePracticeHeaderLayout from "@/features/codepractice/layout/CodePracticeHeaderLayout.jsx";


export default function CodePracticePage() {
  const { isSidebarOpen } = usePracticeUIStore();
  
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
