import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import styles from "./CodeEditorPanel.module.css";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useCodeTestStore } from "../../store/useCodeTestStore";

export default function CodeEditorPanel() {
  const { darkMode } = useDarkMode();

  const code = useCodeTestStore((s) => s.code);
  const setCode = useCodeTestStore((s) => s.setCode);
  const language = useCodeTestStore((s) => s.language);
  const run = useCodeTestStore((s) => s.run);

  const [monacoInstance, setMonacoInstance] = useState(null);

  const applyTheme = (monaco) => {
    if (!monaco) return;

    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg-primary")
      .trim();

    monaco.editor.defineTheme("codeTestTheme", {
      base: darkMode ? "vs-dark" : "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": bg,
      },
    });

    monaco.editor.setTheme("codeTestTheme");
  };

  const handleEditorMount = (_, monaco) => {
    setMonacoInstance(monaco);
    applyTheme(monaco);
  };

  useEffect(() => {
    if (monacoInstance) applyTheme(monacoInstance);
  }, [darkMode, monacoInstance]);

  return (
    <section className={styles.editor}>
      <div className={styles.editorHeader}>
        <span className={styles.title}>Code</span>

        <div className={styles.actions}>
          <button className={styles.runBtn} onClick={run}>
            실행
          </button>
        </div>
      </div>

      <div className={styles.editorBody}>
        <Editor
          height="100%"
          width="100%"
          language={language.toLowerCase()}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          onMount={handleEditorMount}
          theme="codeTestTheme"
          options={{
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
    </section>
  );
}
