
import { Download, X } from "lucide-react";
import { formatDate } from "../../../utils/date";
import { useDeleteFiles } from "../services/classDetailFileService";
import styles from "./FileItem.module.css";

export default function FileItem({ file ,classId,lectureDate,isStudent }) {
  const deleteMutation = useDeleteFiles();
  console.log(lectureDate);

  const handleDelete = () => {
    deleteMutation.mutate({
      classId : classId,
      lectureDate,
      fileIds: [file.fileId],
    });
  }

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <span className={styles.icon}>📄</span>
        <div className={styles.info}>
          <div className={styles.name}>{file.fileName}</div>
          <div className={styles.date}>{formatDate(file.createdAt)}</div>
        </div>
        {!isStudent && (
          <>
            <button className={styles.deleteBtn} onClick={handleDelete}>
                <X size={20} strokeWidth={2.5} />
            </button>
          </>
        )}
        
        <button className={styles.downloadBtn} onClick={handleDownload}>
          <Download size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
