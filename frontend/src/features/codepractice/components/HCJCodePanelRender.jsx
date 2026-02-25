import { useEffect, useRef } from "react";
import styles from './HCJCodePanelRender.module.css';
import { usePracticeStore } from "../store/usePracticeStore";

export default function HCJCodePanelRender() {
  const iframeRef = useRef(null);

  // 렌더링용 상태만 읽기
  const renderHTML = usePracticeStore((state) => state.renderHTML);
  const language = usePracticeStore((state) => state.language);

  useEffect(() => {
    if (language !== "CSS_HTML_JS") return;
    if (!iframeRef.current) return;
    if (!renderHTML) return;

    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc.open();
    iframeDoc.write(renderHTML);
    iframeDoc.close();

  }, [renderHTML, language]);

  return (
    <div className={styles.HCJCodePanelRender}>

      <div className={styles.previewHeader}>
      </div>


      <iframe
        ref={iframeRef}
        className={styles.previewFrame}
        title="HCJ Preview"
      />
    </div>
  );
}
