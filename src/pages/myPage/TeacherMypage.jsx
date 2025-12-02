import styles from "./TeacherMypage.module.css";

import MainHeader from "../../common/layout/MainHeader";
import { MypageSection } from "../../features/myPage/layout/MypageSection";

export default function TeacherMypage() {
  return (
    <div className={styles.app}>
      <MainHeader/>
      <MypageSection />
    </div>
  );
}
