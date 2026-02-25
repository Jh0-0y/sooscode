import { useState } from "react";
import styles from "./HeaderBar.module.css";
import { useDarkMode } from "@/hooks/useDarkMode";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import LogoutButton from "/src/features/auth/components/base/LogoutButton.jsx";
import useLogout from "../../auth/hooks/useLogout";
import { useUser } from "../../../hooks/useUser";

export default function HeaderBar() {

  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const {user} = useUser();
  const profileSrc = user.profileImage;

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
            src={profileSrc}
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
        <button className={styles.logout} onClick={logout}>
          로그아웃
        </button>
      </div>
      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
}
