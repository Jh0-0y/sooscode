import { create } from "zustand";
import { loadPyodideInstance } from "../utils/PyodideLoader";

export const usePracticeStore = create((set, get) => ({
  code: "",
  language: "python",
  output: "",

  setCode: (val) => set({ code: val }),
  setLanguage: (lang) => set({ language: lang }),
  setOutput: (data) => set({ output: data }),

  run: async () => {
  const { code, language } = get();

  if (language === "python") {
    try {
      const pyodide = await loadPyodideInstance();

      // 출력 캡처
      let outputText = "";
      pyodide.setStdout({
        batched: (text) => { outputText += text; }
      });
      pyodide.setStderr({
        batched: (text) => { outputText += text; }
      });

      // 코드 실행
      await pyodide.runPythonAsync(code);

      // 최종 출력 상태 저장
      set({ output: outputText });

    } catch (err) {
      set({ output: String(err) });
    }
    return;
  }
}

}));
