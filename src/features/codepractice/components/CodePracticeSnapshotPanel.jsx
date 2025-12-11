import { useSnapshotStore } from '../store/useSnapshotStore';
import CodePracticeCompileContainer from './CodePracticeCompileContainer'
import CodePracticeHeader from './CodePracticeHeader'
import styles from './CodePracticeSnapshotPanel.module.css'

export default function CodePracticeSnapshotPanel(){
  const title="snapshot"
  const snapshotOutput = useSnapshotStore((s) => s.snapshot);
  
  return(
  <div className={styles.snapshotPanel}>
    <CodePracticeHeader title={title}/>
    <div className={styles.snapshotContainer}></div>
    <CodePracticeCompileContainer
      title="스냅샷 결과"
      output={snapshotOutput}
    />
  </div>
  )
}