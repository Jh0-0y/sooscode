import { useSearchParams } from "react-router-dom";
import { fetchClassInfo, uploadClassThumbnail } from "../../services/classinfoService";
import { useEffect, useState } from "react";
import styles from "./NoticeSection.module.css";
import Header from "./notice/Header";
import Section from "./notice/Section";
import { useUser } from "../../../../hooks/useUser";

// 공지사항 섹션 (사용 X)
export default function NoticeSection() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const [classInfo, setClassInfo] = useState(null);
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    if (!classId) return;
    const load = async () => {
      const data = await fetchClassInfo(classId);
      console.log("classInfo:", data);
      setClassInfo(data);
      setDescription(data.description ?? "");
      setThumbnailPreview(data.thumbnailUrl || null);
    };
    load();
  }, [classId]);

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      console.log(classId);
      console.log(file);
      await uploadClassThumbnail(classId, file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } catch (e) {
      console.error("클래스 썸네일 업로드 실패", e);
      alert("썸네일 업로드에 실패했습니다.");
    }
  };

  if (!classInfo) return null;
  return (
    <section className={styles.wrapper}>
      <div className={styles.sectionContainer}>
        <div className={styles.thumbnailWrapper}>
          {!isStudent ? (
            <label className={styles.label}>
              <img
                className={styles.thumbnail}
                src={thumbnailPreview || "/bruno.png"}
                alt="클래스 썸네일"
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleThumbnailChange}
              />
            </label>
          ) : (
            <img
              className={styles.thumbnail}
              src={thumbnailPreview || "/bruno.png"}
              alt="클래스 썸네일"
            />
          )}
        </div>
        <header className={styles.header}>
          <Header title={classInfo.title} />
        </header>
        <Section classInfo={classInfo} />
      </div>
    </section>
  );
}
