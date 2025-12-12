import { useSnapshotStore } from '../store/useSnapshotStore';
import CodePracticeCompileContainer from './CodePracticeCompileContainer';
import CodePracticeHeader from './CodePracticeHeader';
import Editor from '@monaco-editor/react';
import styles from './CodePracticeSnapshotPanel.module.css';

export default function CodePracticeSnapshotPanel() {
  const title = "snapshot";

  const selectedSnapshot = useSnapshotStore(
    (s) => s.selectedSnapshot
  );

  return (
    <div className={styles.snapshotPanel}>
      <CodePracticeHeader title={title} />

      <div className={styles.snapshotContainer}>
        <Editor
  height="200px"
  theme="vs-dark"
  language={selectedSnapshot?.language || "java"}
  value={
    selectedSnapshot
      ? selectedSnapshot.content
      : "// 스냅샷을 선택하세요"
  }
  options={{
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 13,
    scrollBeyondLastLine: false,
  }}
/>
      </div>

      <CodePracticeCompileContainer
        title="스냅샷 결과"
        output={selectedSnapshot?.output || ""}
      />
    </div>
  );
}
