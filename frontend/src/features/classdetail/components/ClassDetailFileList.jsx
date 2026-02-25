import { useRef } from "react";
import { useClassFiles, useFilesByDate, useUploadFiles } from "../services/classDetailFileService";
import styles from "./ClassDetailFileList.module.css";
import FileItem from "./FileItem";
import { useUser } from "../../../hooks/useUser";

export default function ClassDetailFileList({ classId,lectureDate  }) {
  const { data: fileList } = useClassFiles(classId, 0, 10);
  const { data: dateFiles, isLoading } = useFilesByDate(classId, lectureDate, 0, 10);
  const { user} = useUser();
  // 학생 권한체크
  const isStudent = user?.role === "STUDENT";
  console.log("user:", user);
  console.log("날짜별 파일 api : ", dateFiles )

  const uploadMutation = useUploadFiles();
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("classId", classId);
    formData.append("lectureDate", lectureDate);

    // ★ teacherId 추가 (반드시 필요)
    formData.append("teacherId", 1); // ← 로그인 정보에서 가져오면 됨

    Array.from(files).forEach((f) => formData.append("files", f));

    uploadMutation.mutate(formData);
  };

  if (isLoading) return <div>파일 불러오는 중...</div>;

  console.log(fileList);

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className={styles.titleBox}>
          <span className={styles.icon}>📁</span>
          <span className={styles.title}>강의 자료</span>
        </div>
        <span className={styles.count}>{dateFiles?.totalElements ?? 0}개</span>
      </div>

      <div className={styles.fileList}>
        {dateFiles?.content?.map((file) => (
          <FileItem 
            key={file.fileId} 
            file={file} 
            classId={classId} 
            lectureDate={lectureDate}
            isStudent={isStudent}
          />
        ))}
      </div>

      {!isStudent && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleUpload}
          />

          <button
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            ⬆ 파일 등록
          </button>
        </>
      )}

      
    </div>
  );
}
