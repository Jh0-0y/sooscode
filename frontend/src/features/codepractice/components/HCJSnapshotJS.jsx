import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import styles from "./HCJCodePanelContent.module.css";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useSnapshotStore } from "@/features/codepractice/store/useSnapshotStore";

export default function HCJSnapshotJS() {
  const { darkMode } = useDarkMode();
  const [monacoInstance, setMonacoInstance] = useState(null);

  const snapshot = useSnapshotStore((s) => s.selectedSnapshot);
  const jsCode = snapshot?.js ?? "";
  const js = useSnapshotStore((s) => s.snapshotJS);


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
  }, [jsCode, darkMode]);

  const handleEditorMount = (_, monaco) => {
    setMonacoInstance(monaco);
    applyTheme(monaco);
  };

  return (
    <div className={styles.wrapper}>
      <Editor
        height="100%"
        width="100%"
        language="javascript"
        value={js}
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
