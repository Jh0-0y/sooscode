import { useSnapshotStore } from '../store/useSnapshotStore';
import CodePracticeHeader from './CodePracticeHeader';
import Editor from '@monaco-editor/react';
import styles from './CodePracticeSnapshotPanel.module.css';
import { useDarkMode } from "@/hooks/useDarkMode";
import { useState } from 'react';
import { useEffect } from "react";
import { deleteSnapshot, saveSnapshot, updateSnapshot } from '../services/snapshot/snapshot.api';
import { usePracticeStore } from '../store/usePracticeStore';
import { useToast } from "@/hooks/useToast";
import { useCodePracticeToast } from '../hooks/useCodePracticeToast';

export default function CodePracticeSnapshotPanel() {
  // Hooks, store, 외부상태
  const [editTitle, setEditTitle] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const { darkMode } = useDarkMode();
  const triggerRefresh = useSnapshotStore((s) => s.triggerRefresh);
  const selectedSnapshot = useSnapshotStore((s) => s.selectedSnapshot);
  const setSelectedSnapshot = useSnapshotStore((s) => s.setSelectedSnapshot);
  const language = usePracticeStore((s) => s.language);
  const toast = useCodePracticeToast();
  const classId = usePracticeStore((s) => s.classId);
  // Derived state 
  const hasSnapshot = !!selectedSnapshot;
  const isNew = selectedSnapshot?.isNew === true;

  // util, helper
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
  const handleEditorMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
    applyTheme(monaco); // 초기 적용
  };

    /* auto action Effect */
  // 에디터 다크모드 변경 hook
  useEffect(() => {
    if (monacoInstance) {
      applyTheme(monacoInstance);
    }
    }, [darkMode]);
  // 스냅샷 선택상태 변경시 UI 상태 정상화
  useEffect(() => {
    if (!selectedSnapshot) return;
    // 새 스냅샷이면 readOnly 건드리지 말 것
    if (selectedSnapshot.isNew) {
      setEditTitle(selectedSnapshot.title || "");
      return;
    }

  // 기존 스냅샷만 readOnly 처리
  setIsReadOnly(true);
  setEditTitle(selectedSnapshot.title || "");}, [selectedSnapshot]);

    /* Event Handler + actions */
  // new snapshot create hook
  const handleCreateSnapshot = () => {
    const newSnapshot = {
      snapshotId: null, // 아직 서버 저장 전
      title: "새 스냅샷",
      content: "",
      language: language,
      isNew: true, // 새 스냅샷 구분용
    };

  setSelectedSnapshot(newSnapshot);
  setEditTitle(newSnapshot.title);
  setIsReadOnly(false); // 바로 편집 가능
  };
  // new snapshot save hook
  const handleSaveNewSnapshot = async () => {
    if (!editorInstance) return;

    try {
      const content = editorInstance.getValue();

      const res = await saveSnapshot({
        title: editTitle || "새 스냅샷",
        content,
        classId: 1,
        language:language
      });

      // 새로 저장된 스냅샷으로 상태 교체
      setSelectedSnapshot({
        snapshotId: res.snapshotId, // 백엔드에서 내려주는 ID
        title: editTitle,
        content,
        language: language,
        isNew: false, // 🔥 중요
      });
      toast.saveSuccess();

      setIsReadOnly(true);
      triggerRefresh(); // 왼쪽 리스트 재조회
    } catch (e) {
      console.error("새 스냅샷 저장 실패", e);
      toast.saveFail();
    }
  };
  // delete hook
  const handleDeleteSnapshot = async () => {
    if (!selectedSnapshot?.snapshotId) {
      alert("삭제할 스냅샷이 없습니다.");
      return;
    }

    const ok = confirm("정말 이 스냅샷을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteSnapshot({
        classId: 1,
        snapshotId: selectedSnapshot.snapshotId,
      });

      setSelectedSnapshot(null); // 선택 해제
      triggerRefresh();          // 리스트 갱신

      console.log("스냅샷 삭제 완료");
      toast.deleteSuccess
    } catch (e) {
      console.error("스냅샷 삭제 실패", e);
      toast.deleteFail
    }
  };
  // revise hook
  const handleCancelEdit = () => {
    if (selectedSnapshot?.isNew) {
      setSelectedSnapshot(null);
    } else {
      setEditTitle(selectedSnapshot.title);
      setIsReadOnly(true);
    }
  };


return (
  <div className={styles.snapshotPanel}>
    <CodePracticeHeader 
      title={
        isReadOnly ? (
          <span className={styles.ellipsisTitle}>
            {selectedSnapshot?.title || "snapshot"}
          </span>
        ) : (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={styles.titleInput}
            autoFocus
          />
        )
      }
      showCopyButton={!!selectedSnapshot && !isNew && isReadOnly}
      onCopy={() => {if (!editorInstance) return;
        navigator.clipboard.writeText(editorInstance.getValue());
        toast.copySuccess();
      }}
      showEditButton={hasSnapshot && !isNew && isReadOnly}
      onEdit={hasSnapshot && !isNew && isReadOnly ? () => setIsReadOnly(false) : null}
      onCreate={!!classId && !hasSnapshot || (hasSnapshot && !isNew && isReadOnly) ? handleCreateSnapshot : null}
      onSaveNew={hasSnapshot && isNew ? handleSaveNewSnapshot : null}
      showSaveButton={hasSnapshot && !isNew && !isReadOnly}
      onSave={
        hasSnapshot && !isNew && !isReadOnly
          ? async () => {
              const newCode = editorInstance?.getValue();
              if (newCode == null) return;

              try {
                await updateSnapshot({
                  snapshotId: selectedSnapshot.snapshotId,
                  title: editTitle,
                  content: newCode,
                });
                setSelectedSnapshot({
                  ...selectedSnapshot,
                  title: editTitle,
                  content: newCode,
                });
                setIsReadOnly(true);
                triggerRefresh();
              } catch (e) {
                console.error("❌ 스냅샷 저장 실패", e);
              }
            }
          : null
      }
      onDelete={hasSnapshot && !isNew && isReadOnly ? handleDeleteSnapshot : null}
      onCancel={hasSnapshot && (!isReadOnly || isNew) ? handleCancelEdit : null}
        />
          <div className={styles.snapshotContainer}>
            <Editor
              height="100%"
              width="100%"
              theme="customTheme"
              onMount={handleEditorMount}
              language={selectedSnapshot?.language || "JAVA"}
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
        </div>
      );
    }
