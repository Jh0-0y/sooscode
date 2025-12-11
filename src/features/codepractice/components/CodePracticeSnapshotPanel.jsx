import CodePracticeCompileContainer from './CodePracticeCompileContainer'
import CodePracticeHeader from './CodePracticeHeader'
import styles from './CodePracticeSnapshotPanel.module.css'

export default function CodePracticeSnapshotPanel(){
  const title="snapshot"
  return(
  <div className={styles.snapshotPanel}>
    <CodePracticeHeader title={title}/>
    <div className={styles.snapshotContainer}></div>
    <CodePracticeCompileContainer/>
  </div>
  )
}