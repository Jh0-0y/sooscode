import { useState, useMemo } from "react";
import { SNIPPET_CATEGORIES } from "./snippet/snippet.types";
import { SNIPPETS_BY_LANGUAGE } from "./snippet";
import { usePracticeStore } from "../../store/usePracticeStore";
import SnippetItem from "./snippet/SnippetItem";
import styles from "./SnippetPanel.module.css";
export default function SnippetPanel() {
  const [selectedCategory, setSelectedCategory] = useState("기본문법");
  const [open, setOpen] = useState(false);
  const language = usePracticeStore((s) => s.language);
  const setCode = usePracticeStore((s) => s.setCode);
  const setHTML = usePracticeStore((s) => s.setHTML);
  const setCSS = usePracticeStore((s) => s.setCSS);
  const setJS = usePracticeStore((s) => s.setJS);


  const filteredSnippets = useMemo(() => {
    const all = SNIPPETS_BY_LANGUAGE[language] || [];
    return all.filter((s) => s.category === selectedCategory);
  }, [language, selectedCategory]);

  const handlePaste = (s) => {
  if (language === "CSS_HTML_JS") {
    setHTML(s.code.html);
    setCSS(s.code.css);
    setJS(s.code.js);
    return;
  }

  setCode(s.code);
};
  return (
    <div>
      <div className={styles.dropdown}>
        <button
          className={styles.dropdownButton}
          onClick={() => setOpen((v) => !v)}
        >
          {selectedCategory} ▾
        </button>

        {open && (
          <ul className={styles.dropdownList}>
            {SNIPPET_CATEGORIES.map((cat) => (
              <li
                key={cat}
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpen(false);
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 스니펫 카드 */}
      <div className={styles.list}>
        {filteredSnippets.map((snippet) => (
          <SnippetItem
            key={snippet.id}
            snippet={snippet}
            onClick={(s) => {
              console.log("선택한 스니펫:", s);
              // 다음 단계: 에디터에 삽입
              handlePaste(s)
            }}
          />
        ))}
      </div>
    </div>
  );
}
