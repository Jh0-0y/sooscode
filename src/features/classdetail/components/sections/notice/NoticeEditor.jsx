import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

import NoticeEditorToolbar from "./NoticeEditorToolbar";
import styles from "./NoticeEditor.module.css";

export default function NoticeEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "공지 내용을 입력하세요…",
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      // ✅ HTML string 하나만 유지
      onChange(editor.getHTML());
    },
  });

  // 서버에서 불러온 description 동기화
  useEffect(() => {
  if (!editor) return;

  const current = editor.getHTML();
  if (current === value) return; // ★ 중요

  editor.commands.setContent(value || "", false);
}, [value, editor]);

  return (
    <div className={styles.editorWrapper}>
      <NoticeEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
