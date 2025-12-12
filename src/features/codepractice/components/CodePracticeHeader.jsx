import styles from './CodePracticeHeader.module.css';

export default function CodePracticeHeader({
  title,
  showEditButton = false,
  onEdit,
  showSaveButton = false,
  onSave,
}){
  return(
    <>
      
      <div className={styles.header}>
        {title}
        <div className={styles.lang}>
          
          JAVA
          {showEditButton && (
          <button
            className={styles.editBtn}
            onClick={onEdit}
          >
            수정
          </button>
        )}

        {showSaveButton && (
          <button
            className={styles.saveBtn}
            onClick={onSave}
          >
            저장
          </button>
        )}
          
        </div>
      </div>
      
    </>
  );
}