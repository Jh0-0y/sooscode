import CoursesSection from "../components/CoursesSection";
import ProfileSection from "../components/ProfileSection";
import styles from "./MypageSection.module.css";

export function MypageSection() {
  return (
      <main className={styles.mainContent}>
        <ProfileSection styles={styles} />
        <CoursesSection styles={styles} />
      </main>
  );
}