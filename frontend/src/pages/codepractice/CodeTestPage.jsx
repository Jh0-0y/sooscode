import { useState, useEffect } from "react";
import ProblemPanel from "../../features/codepractice/components/codingtest/ProblemPanel";
import TestHeader from "../../features/codepractice/components/codingtest/TestHeader";
import CodeEditorPanel from "../../features/codepractice/components/codingtest/CodeEditorPanel";
import ResultPanel from "../../features/codepractice/components/codingtest/ResultPanel";

import { testProblems } from "@/features/codepractice/components/codingtest/testProblems.mock";
import { runUserCode, judgeAll } from "@/features/codepractice/components/codingtest/judge";

import styles from "./CodeTestPage.module.css";
import ResultModal from "../../features/codepractice/components/codingtest/ResultModal";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function CodeTestPage() {
  const [problem, setProblem] = useState(testProblems[0]);
  const [code, setCode] = useState(problem.template.js);
  const [results, setResults] = useState(null);

  // 문제 바뀌면 코드 템플릿 초기화
  useEffect(() => {
    setCode(problem.template.js);
    setResults(null);
  }, [problem]);

  const handleRun = () => {
    const r = runUserCode(code, problem.testCases[0].input);
    setResults([
      {
        index: 0,
        input: problem.testCases[0].input,
        expected: problem.testCases[0].output,
        actual: r.output,
        pass: r.output === problem.testCases[0].output,
        error: r.error,
      },
    ]);
    console.log("결과 : " , results);
  };

  const handleSubmit = () => {
    const r = judgeAll(code, problem.testCases);
    setResults(r);
    console.log("결과 : " , results);
  };

  useEffect(() => {
    console.log("문제 : ",problem)
    console.log("코드 : ", code)
    console.log("결과 : ", results)
  })

  return (
    <div className={styles.CodeTestPage}>
      <header className={styles.header}>
        <TestHeader problem={problem} />
      </header>

      <div className={styles.main}>
        <PanelGroup direction="horizontal">

          <Panel defaultSize={30} minSize={20}>
            <section className={styles.problem}>
              <ProblemPanel problem={problem} />
            </section>
          </Panel>

          <PanelResizeHandle className={styles.resizeBar} />

          <Panel defaultSize={70} minSize={20}>
            <section className={styles.editor}>
              <CodeEditorPanel
                code={code}
                onChangeCode={setCode}
                onRun={handleRun}
                onSubmit={handleSubmit}
              />
            </section>
          </Panel>

        </PanelGroup>
      </div>

      <section className={styles.result}>
        <ResultPanel results={results} />
        <ResultModal />
      </section>
      
    </div>
  );
}
