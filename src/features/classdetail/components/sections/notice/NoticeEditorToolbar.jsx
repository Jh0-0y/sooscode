import styles from "./NoticeEditor.module.css";

export default function NoticeEditorToolbar({ editor }) {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("링크 주소 입력", prev);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className={styles.toolbar}>
      {/* 텍스트 */}
      <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
      <button onClick={() => editor.chain().focus().toggleCode().run()}>{`</>`}</button>

      <span className={styles.divider} />

      {/* 구조 */}
      <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

      <span className={styles.divider} />

      {/* 리스트 */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</button>

      <span className={styles.divider} />

      {/* 코드 */}
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>

      <span className={styles.divider} />

      {/* 링크 */}
      <button onClick={setLink}>🔗</button>

      <span className={styles.divider} />

      {/* 편의 */}
      <button onClick={() => editor.chain().focus().undo().run()}>↩︎</button>
      <button onClick={() => editor.chain().focus().redo().run()}>↪︎</button>

      {/* 초기화 */}
      <button
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        Clear
      </button>
    </div>
  );
}
