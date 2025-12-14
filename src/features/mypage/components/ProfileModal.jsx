import { useState } from "react";
import styles from "./ProfileModal.module.css";
import defaultImg from "@/assets/img1.jpg";
import { updatePassword, deleteUser } from "@/features/mypage/services/mypageService";
import { useUser } from "@/hooks/useUser";

export default function ProfileModal({ onClose }) {
    const profileImage = "/bruno.png";
  const { user, clearUser } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    try {
      await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      alert("비밀번호 변경 실패");
    }
  };

  const handleDeleteUser = async () => {
    const ok = confirm("정말 회원 탈퇴하시겠습니까?");
    if (!ok) return;

    try {
      await deleteUser();
      clearUser();
      window.location.href = "/";
    } catch (e) {
      alert("회원 탈퇴 실패");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>개인정보 설정</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </header>

        {/* ===== 프로필 정보 ===== */}
        <section className={styles.section}>
        <div className={styles.imgSection}>
            <img
            src={profileImage}
            alt="profile"
            className={styles.profileImage}
            />
        </div>
          
          <div className={styles.infoRow}>
            <span>이름</span>
            <span>{user?.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span>이메일</span>
            <span>{user?.email}</span>
          </div>
        </section>

        {/* ===== 비밀번호 변경 ===== */}
        <section className={styles.section}>
          <button onClick={handlePasswordChange}>
            비밀번호 재설정
          </button>
        </section>

        {/* ===== 회원 탈퇴 ===== */}
        <section className={`${styles.section} ${styles.danger}`}>
          <button onClick={handleDeleteUser}>
            회원 탈퇴
          </button>
        </section>
      </div>
    </div>
  );
}
