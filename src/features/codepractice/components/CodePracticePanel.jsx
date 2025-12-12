import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import styles from './CodePracticePanel.module.css';
import { useDarkMode } from "@/hooks/useDarkMode";
import CodePracticeHeader from './CodePracticeHeader';
import CodePracticeCompileContainer from './CodePracticeCompileContainer';
import { usePracticeStore } from '../store/usePracticeStore';

export default function CodePracticePanel() {
  const { darkMode } = useDarkMode();
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);

  const code = usePracticeStore((s) => s.code);
  const setCode = usePracticeStore((s) => s.setCode);
  const language = usePracticeStore((s) => s.language);
  const setLanguage = usePracticeStore((s) => s.setLanguage);
  const storeOutput = usePracticeStore((s) => s.output);



  const title="code practice"

  // 테마 생성 함수 (라이트/다크 자동 적용)
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

  // Editor 로딩 시 실행
  const handleEditorMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
    applyTheme(monaco); // 초기 적용
  };

  // ★ 다크모드 바뀔 때마다 테마 재적용
  useEffect(() => {
    if (monacoInstance) {
      applyTheme(monacoInstance);
    }
  }, [darkMode]);

  return (
    <div className={styles.practicePanel}>
      <CodePracticeHeader 
          title={title}
          onChangeLang={setLanguage}
      />

      <div className={styles.codeContainer}>
        <Editor
          height="100%"
          width="100%"
          language={language}     // ← 여기!
          value={code}
          onChange={(v) => setCode(v)}
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
            renderLineHighlight: "none",
          }}
        />

      </div>

      <CodePracticeCompileContainer
      title={"코드 실행 결과"}
      output={storeOutput}
    />
    </div>
  );
}
