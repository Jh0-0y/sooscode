import styles from "./StudentMypage.module.css";

import MainHeader from "../../common/layout/MainHeader";
import { MypageSection } from "../../features/myPage/layout/MypageSection";

export default function StudentMypage() {
  return (
    <div className={styles.app}>
      <MainHeader/>
      <MypageSection />
    </div>
  );
}
