import styles from "./ProblemPanel.module.css";
import { useCodeTestStore } from "../../store/useCodeTestStore";

export default function ProblemPanel() {
  const problem = useCodeTestStore((s) => s.problem);

  if (!problem) return null;

  return (
    <>
      <h2 className={styles.title}>{problem.title}</h2>

      {/* 태그 / 카테고리 */}
      <div className={styles.category}>
        <span>{problem.category}</span>
        <span>{problem.level}</span>
      </div>

      {/* 문제 설명 */}
      <div className={styles.description}>
        {problem.description.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* 입력 예시 */}
      {problem.example && (
        <pre className={styles.example}>
          {problem.example}
        </pre>
      )}
    </>
  );
}
