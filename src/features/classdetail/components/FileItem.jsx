
import { Download, X } from "lucide-react";
import { formatDate } from "../../../utils/date";
import { useDeleteFiles } from "../services/classDetailFileService";
import styles from "./FileItem.module.css";

export default function FileItem({ file ,classId,lectureDate }) {
  const deleteMutation = useDeleteFiles();
  console.log(lectureDate);

  const handleDelete = () => {
    deleteMutation.mutate({
      classId : classId,
      lectureDate,
      fileIds: [file.fileId],
    });
  }

  // 기능 추가예정
  const handleDownload = () => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const downloadUrl = `${baseURL}/${file.fileUrl}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.fileName;
    link.click();
  };

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <span className={styles.icon}>📄</span>
        <div className={styles.info}>
          <div className={styles.name}>{file.fileName}</div>
          <div className={styles.date}>{formatDate(file.createdAt)}</div>
        </div>
        <button className={styles.deleteBtn} onClick={handleDelete}>
            <X size={20} strokeWidth={2.5} />
        </button>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          <Download size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
