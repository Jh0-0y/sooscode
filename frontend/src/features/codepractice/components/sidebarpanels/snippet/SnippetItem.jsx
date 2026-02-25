import styles from "./SnippetItem.module.css";

export default function SnippetItem({ snippet, onClick }) {
  return (
    <div className={styles.card} onClick={() => onClick?.(snippet)}>
      <div className={styles.title}>
        {snippet.title}
        {snippet.isSystem && <span className={styles.system}>★</span>}
      </div>

      {snippet.description && (
        <div className={styles.desc}>{snippet.description}</div>
      )}
    </div>
  );
}
