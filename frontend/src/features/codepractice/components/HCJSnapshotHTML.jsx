import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import styles from "./HCJCodePanelContent.module.css";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useSnapshotStore } from "@/features/codepractice/store/useSnapshotStore";

export default function HCJSnapshotHTML() {
  const { darkMode } = useDarkMode();
  const [monacoInstance, setMonacoInstance] = useState(null);

  const snapshot = useSnapshotStore((s) => s.selectedSnapshot);
  const htmlCode = snapshot?.html ?? "";
  const html = useSnapshotStore((s) => s.snapshotHTML);

  const applyTheme = (monaco) => {
    if (!monaco) return;

    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg-primary")
      .trim();

    const baseTheme = darkMode ? "vs-dark" : "vs";

    monaco.editor.defineTheme("snapshotTheme", {
      base: baseTheme,
      inherit: true,
      rules: [],
      colors: {
        "editor.background": bg,
      },
    });

    monaco.editor.setTheme("snapshotTheme");
  };

  useEffect(() => {
    if (!monacoInstance) return;
    requestAnimationFrame(() => applyTheme(monacoInstance));
  }, [htmlCode, darkMode]);

  const handleEditorMount = (_, monaco) => {
    setMonacoInstance(monaco);
    applyTheme(monaco);
  };

  return (
    <div className={styles.wrapper}>
      <Editor
        height="100%"
        width="100%"
        language="html"
        value={html}
        onMount={handleEditorMount}
        theme="snapshotTheme"
        options={{
          readOnly: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 2,
          lineDecorationsWidth: 5,
          glyphMargin: false,
          folding: false,
        }}
      />
    </div>
  );
}
