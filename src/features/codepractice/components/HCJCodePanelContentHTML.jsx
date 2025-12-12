import Editor from "@monaco-editor/react";
import styles from "./HCJCodePanelContent.module.css";

export default function HCJCodePanelContentHTML({ code, onChange }) {
  return (
    <div className={styles.wrapper}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="html"
        value={code}
        onChange={(value) => onChange(value)}
        theme="vs-dark"
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
