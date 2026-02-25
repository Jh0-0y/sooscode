import CodePracticePanel from "../components/CodePracticePanel";
import CodePracticeSnapshotPanel from "../components/CodePracticeSnapshotPanel";
import { usePracticeUIStore } from "../store/usePracticeUIStore";
import styles from "./CodePracticeSection.module.css";

export default function CodePracticeSection(){
  const { isSnapshotOpen } = usePracticeUIStore();

  return (
    <div className={styles.practiceContainer}>
      <div className={styles.panel}>
        <CodePracticePanel />
      </div>

      {isSnapshotOpen && (
        <div className={styles.snapshot}>
          <CodePracticeSnapshotPanel />
        </div>
      )}
    </div>
  );
}
