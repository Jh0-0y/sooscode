// features/codepractice/store/useCodeTestStore.js
import { create } from "zustand";
import { runInWorker } from "../components/codingtest/judge.runner";
import { testProblems } from "../components/codingtest/testProblems.mock";

export const useCodeTestStore = create((set, get) => ({
  problem: testProblems[0],
  code: testProblems[0].template.js,
  language: "JS",
  passed: null, 
  showResultModal: false,
  isRunning: false,
  error: null,

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setProblem: (problem) =>
    set({
      problem,
      code: problem.template.js,
      passed: null,
      showResultModal: false,
    }),
  run: async () => {
  const { code, problem } = get();
  const tc = problem.testCases[0];

  try {
    set({
      isRunning: true,
      showResultModal: true,
      passed: null,
      error: null,
    });

    const res = await runInWorker(
      {
        mode: "run",
        userCode: code,
        testCases: [tc],
      },
      5000
    );

    if (!res.success) {
      set({
        passed: false,
        error: res.error ?? "실행 오류",
      });
      return;
    }

    set({
      passed: res.result.output === tc.output,
      isRunning: false,
    });
  } catch (e) {
    set({
      passed: false,
      error: e.message, // Time Limit Exceeded
      isRunning: false,
    });
  }
},



  closeResultModal: () =>
    set({ showResultModal: false }),
}));
