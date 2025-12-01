import styles from "./StudentMypage.module.css";

import Header from "../../common/components/Header";
import ProfileSection from "../../features/myPage/components/ProfileSection";
import CoursesSection from "../../features/myPage/components/CoursesSection";

export default function TeacherMypage() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <ProfileSection styles={styles} />
        <CoursesSection styles={styles} />
      </main>
    </div>
  );
}
