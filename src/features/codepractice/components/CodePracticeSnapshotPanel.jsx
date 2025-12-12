import { useSnapshotStore } from '../store/useSnapshotStore';
import CodePracticeCompileContainer from './CodePracticeCompileContainer';
import CodePracticeHeader from './CodePracticeHeader';
import Editor from '@monaco-editor/react';
import styles from './CodePracticeSnapshotPanel.module.css';
import { useDarkMode } from "@/hooks/useDarkMode";
import { useState } from 'react';
import { useEffect } from "react";
import { updateSnapshot } from '../services/snapshot/snapshot.api';

export default function CodePracticeSnapshotPanel() {
  const title = "snapshot";
  const [editTitle, setEditTitle] = useState("");
  // 트리거
  const triggerRefresh = useSnapshotStore((s) => s.triggerRefresh);
  
  const selectedSnapshot = useSnapshotStore((s) => s.selectedSnapshot);
  const setSelectedSnapshot = useSnapshotStore((s) => s.setSelectedSnapshot);

  const handleEditorMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
    applyTheme(monaco); // 초기 적용
  };
  const { darkMode } = useDarkMode();
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const applyTheme = (monaco) => {
    if (!monaco) return;
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg-primary")
      .trim();
    const baseTheme = darkMode ? "vs-dark" : "vs";
    monaco.editor.defineTheme("customTheme", {
      base: baseTheme,
      inherit: true,
      rules: [],
      colors: {
        "editor.background": bg,
      },
    });
    monaco.editor.setTheme("customTheme");
  };
  console.log(editorInstance)
  console.log(monacoInstance)

  useEffect(() => {
  if (monacoInstance) {
    applyTheme(monacoInstance);
  }
}, [darkMode]);

useEffect(() => {
  setIsReadOnly(true);
  setEditTitle(selectedSnapshot?.title || "");
}, [selectedSnapshot]);





  return (
    <div className={styles.snapshotPanel}>
      <CodePracticeHeader 
        title={
          isReadOnly ? (
            selectedSnapshot?.title || "snapshot"
          ) : (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={styles.titleInput}
              autoFocus
            />
          )
        }
        showEditButton={isReadOnly}
        onEdit={() => setIsReadOnly(false)}
        showSaveButton={!isReadOnly}
        onSave={async () => {
        if (!selectedSnapshot) return;

        const newCode = editorInstance?.getValue();
        if (newCode == null) return;

        try {
          // 1️⃣ 서버 저장
          await updateSnapshot({
            snapshotId: selectedSnapshot.snapshotId,
            title: editTitle,
            content: newCode,
          });

          // 2️⃣ Zustand 갱신 (이거 없으면 화면이 원래대로 돌아감)
          setSelectedSnapshot({
            ...selectedSnapshot,
            title: editTitle,
            content: newCode,
          });

          // 3️⃣ 다시 읽기 전용
          setIsReadOnly(true);

          console.log("✅ 스냅샷 저장 완료");
          triggerRefresh();
        } catch (e) {
          console.error("❌ 스냅샷 저장 실패", e);
        }
      }}

/>

      
      <div className={styles.snapshotContainer}>
        <Editor
          height="100%"
          width="100%"
          theme="customTheme"
          onMount={handleEditorMount}
          language={selectedSnapshot?.language || "java"}
          value={
            selectedSnapshot
              ? selectedSnapshot.content
              : "// 스냅샷을 선택하세요"
          }
          
          options={{
            readOnly: isReadOnly,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbersMinChars: 2,
            lineDecorationsWidth: 5,
            glyphMargin: false,
            folding: false,
            renderLineHighlight: "none",
          }}
        />
      </div>

      {/* <CodePracticeCompileContainer
        title="스냅샷 결과"
        output={selectedSnapshot?.output || ""}
      /> */}
    </div>
  );
}
