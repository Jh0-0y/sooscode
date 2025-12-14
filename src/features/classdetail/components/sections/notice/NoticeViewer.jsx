import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./NoticeViewer.module.css";

export default function NoticeViewer({ content }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  });

  if (!editor) return null;

  return (
    <div className={styles.viewer}>
      <EditorContent editor={editor} />
    </div>
  );
}
