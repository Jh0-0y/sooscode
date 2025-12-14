import { useState } from "react";
import styles from "./HeaderBar.module.css";
import { useDarkMode } from "@/hooks/useDarkMode";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";

export default function HeaderBar() {

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  

  return (
    <div className={styles.header}>
      <div 
        className={styles.left}
        onClick={() => {navigate('/')}}
      >
        <div className="logo" />
      </div>
      <div className={styles.center}>마이페이지</div>
      <div className={styles.right}>
        <button
          className={styles.profileButton}
          onClick={() => setIsProfileModalOpen(true)}
          >
          <img
            src="/bruno.png"
            alt="profile"
            className={styles.profileImage}
          />
        </button>
        <button className={styles.codePractice} onClick={() => navigate("/codepractice")}>
          코드연습
        </button>
        <button onClick={toggleDarkMode} className={styles.actionBtn}>
            {darkMode ? "🌙 다크모드" : "☀️ 라이트모드"}
        </button>
      </div>
      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
}
