import { Pencil } from "lucide-react";
import styles from "./ProfileCard.module.css";
import defaultImg from "@/assets/img1.jpg";
import { useState } from "react";
import EditModal from "./EditModal";
import { updateProfile,uploadProfileImage} from "../services/mypageService.js";

export default function ProfileCard({ name, email, imageUrl }) {

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [currentName, setCurrentName] = useState(name);
  const [currentImage, setCurrentImage] = useState(imageUrl);

  const handleSave = async () => {
    try{
      if(editName.length>16){
        alert("이름은 16글자 이내여야 합니다.");
        return;
      }
      const res = await updateProfile({name : editName});
      setCurrentName(editName);
      console.log(res.data);
    }catch(e){
      console.log("프로필 수정 실패")
    }
  }

  const handleImageChange = async (e) => {
  const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadProfileImage(file);

      // 즉시 화면 반영
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage(previewUrl);
    } catch (e) {
      console.log("프로필 이미지 변경 실패");
    }
  };

  return (
    <div className={styles.profileContainer}>

      {/* 상단 배경 */}
      <div className={styles.profileBackground}></div>

      {/* 프로필 이미지 */}
      <label style={{ cursor: "pointer" }}>
        <img
          src={currentImage || defaultImg}
          alt="profile"
          className={styles.profileImage}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </label>

      {/* 사용자 정보 섹션 */}
      <div className={styles.profileContentSection}>
        
        <div className={styles.nameContainer}>
          <div className={styles.label}>사용자명</div>
          <div className={styles.nameContent}>
            <div className={styles.value}>{currentName}</div>
            <div 
              className={styles.editButton}
              onClick={() => setIsEditOpen(true)}
              title="수정"           
            >
              <Pencil size={16}/>  
            </div>
          </div>
        </div>

        <div className={styles.emailContainer}>
          <div className={styles.label}>이메일</div>
          <div className={styles.value}>{email}</div>
        </div>

      </div>

      {isEditOpen && (
        <EditModal
          value={editName}
          onChange={setEditName}
          onClose={() => setIsEditOpen(false)}
          onSave={async () => {
            await handleSave();
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
}
