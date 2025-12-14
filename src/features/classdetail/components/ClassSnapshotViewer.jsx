import styles from "./ClassSnapshotViewer.module.css";
import { FiCopy, FiDownload, FiMaximize2 } from "react-icons/fi";

export default function ClassSnapshotViewer({ filename = "example.java", code ,onExpand}) {
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("코드 복사 완료!");
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleExpand = () => {
    if (onExpand) {
      onExpand({ title: filename, content: code });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.filename}>{filename}</span>

        <div className={styles.icons}>
          <FiCopy className={styles.icon} onClick={handleCopy} />
          <FiDownload className={styles.icon} onClick={handleDownload} />
          <FiMaximize2 className={styles.icon} onClick={handleExpand} />
        </div>
      </div>

      <pre className={styles.codeBlock} onClick={handleExpand}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
