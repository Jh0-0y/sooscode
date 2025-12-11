import styles from './CodePracticeCompileContainer.module.css';
import { usePracticeStore } from "../store/usePracticeStore";

export default function CodePracticeCompileContainer() {
  const output = usePracticeStore((s) => s.output);

  console.log(output);
  console.log(output);
  console.log(output);
  console.log(output);
  return (
    <div className={styles.compileContainer}>
      <pre className={styles.outputText}>
        {output}
      </pre>
    </div>
  );
}
