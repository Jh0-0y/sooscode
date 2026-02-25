import styles from "./ProblemSelect.module.css";
import { useCodeTestStore } from "../../store/useCodeTestStore";

//const LANGS = ["JS", "PYTHON", "JAVA"];
const LANGS = ["JS","다언어 기능 준비중입니다"];

export default function LanguageSelect({ open, onToggle, onClose }) {
  const language = useCodeTestStore((s) => s.language);
  const setLanguage = useCodeTestStore((s) => s.setLanguage);

  return (
    <div className={styles.wrapper}>
      <button className={styles.trigger} onClick={onToggle}>
        {language}
        <span className={styles.arrow}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {LANGS.map((lang) => (
            <div
              key={lang}
              className={styles.item}
              onClick={() => {
                if(lang==="다언어 기능 준비중입니다"){
                  onClose();
                  return;
                }
                setLanguage(lang);
                onClose();
              }}
            >
              <div className={styles.itemTitle}>{lang}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
