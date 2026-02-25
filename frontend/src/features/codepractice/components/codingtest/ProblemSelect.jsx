import { useEffect, useRef, useState } from "react";
import styles from "./ProblemSelect.module.css";
import { useCodeTestStore } from "../../store/useCodeTestStore";
import { testProblems } from "./testProblems.mock";

const PAGE_SIZE = 10;

export default function ProblemSelect({ open, onToggle, onClose }) {
  const problem = useCodeTestStore((s) => s.problem);
  const setProblem = useCodeTestStore((s) => s.setProblem);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef(null);

  // 드롭다운 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setVisibleCount(PAGE_SIZE);
    }
  }, [open]);

  // IntersectionObserver
  useEffect(() => {
    if (!open) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, testProblems.length)
          );
        }
      },
      {
        root: document.querySelector(`.${styles.dropdown}`),
        threshold: 1.0,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [open]);

  return (
    <div className={styles.wrapper}>
      <button className={styles.trigger} onClick={onToggle}>
        {problem.title}
        <span className={styles.arrow}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {testProblems.slice(0, visibleCount).map((p) => (
            <div
              key={p.id}
              className={styles.item}
              onClick={() => {
                setProblem(p);
                onClose();
              }}
            >
              <div className={styles.itemTitle}>{p.title}</div>
            </div>
          ))}

          {/* sentinel */}
          {visibleCount < testProblems.length && (
            <div ref={loaderRef} className={styles.loader}>
              불러오는 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
