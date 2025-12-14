import styles from './CodePracticeHeader.module.css';

// 스냅샷 패널 및 코드연습 패널에서 사용하는 공통 컴포넌트

export default function CodePracticeHeader({
  title,
  showEditButton = false,
  onEdit,
  showSaveButton = false,
  onSave,
  onCreate,
  onSaveNew,
  onDelete,
  onCancel,
  showCopyButton = false,
  onCopy,  
}){
  return(
    <div>
      <div className={styles.header}>
        {title}
        <div className={styles.lang}>
          {showCopyButton && (<button className={styles.copyBtn} onClick={onCopy}>복사</button>)}
          {onCreate && (<button className={styles.createBtn} onClick={onCreate}>새 스냅샷</button>)}
          {onSaveNew && (<button className={styles.saveBtn} onClick={onSaveNew}>새 스냅샷 저장</button>)}
          {showSaveButton && (<button className={styles.saveBtn} onClick={onSave}>저장</button>)}
          {showEditButton && (<button className={styles.editBtn} onClick={onEdit}>수정</button>)}
          {onDelete && (<button className={styles.deleteBtn} onClick={onDelete}>삭제</button>)}
          {onCancel && (<button className={styles.cancelBtn} onClick={onCancel}>취소</button>)}
        </div>
      </div>
    </div>
  );
}