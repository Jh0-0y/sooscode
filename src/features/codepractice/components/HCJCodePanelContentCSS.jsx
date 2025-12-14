import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import styles from "./HCJCodePanelContent.module.css";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function HCJCodePanelContentCSS({ code, onChange }) {
  const { darkMode } = useDarkMode();
  const [monacoInstance, setMonacoInstance] = useState(null);

  // === CodePracticePanel에서 가져온 테마 로직 ===
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

  useEffect(() => {
  if (!monacoInstance) return;

  requestAnimationFrame(() => {
    applyTheme(monacoInstance);
  });
}, [code, darkMode]);
  // ===========================================

  const handleEditorMount = (_, monaco) => {
    setMonacoInstance(monaco);
    applyTheme(monaco);
  };

  return (
    <div className={styles.wrapper}>
      <Editor
        height="100%"
        width="100%"
        language="css"
        value={code}
        onChange={(value) => onChange(value)}
        onMount={handleEditorMount}
        theme="customTheme"
        options={{
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
