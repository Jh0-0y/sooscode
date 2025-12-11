import { create } from "zustand";
import { loadPyodideInstance } from "../utils/PyodideLoader";
import { runJavaCode } from "../services/compile/compile.api";

function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export const usePracticeStore = create((set, get) => ({
  code: `print("Hello Python!")`,
  language: "python",
  output: "",

  setCode: (val) => set({ code: val }),
  setLanguage: (lang) => set({ language: lang }),
  setOutput: (data) => set({ output: data }),
  resetCode: () => set({ code: "" }),

  run: async () => {
    const { code, language } = get();

    // =======================================
    // Python 실행
    // =======================================
    if (language === "python") {
      try {
        console.log("python compile 실행");
        const pyodide = await loadPyodideInstance();

        let outputText = "";

        pyodide.globals.set("print", (...args) => {
          outputText += args.join(" ") + "\n";
        });

        pyodide.globals.set("print_err", (...args) => {
          outputText += args.join(" ") + "\n";
        });

        await pyodide.runPythonAsync(code);

        set({ output: outputText });
      } catch (err) {
        set({ output: String(err) });
      }
      return;
    }

    // =======================================
    // Java 실행
    // =======================================
    if (language === "java") {
  try {
    console.log("java 컴파일러 실행");

    const encoded = encodeBase64(code);

    // ★ 이제 result = output 텍스트 그 자체
    const output = await runJavaCode({ code: encoded });

    set({ output });

  } catch (err) {
    set({
      output:
        err.response?.data?.message ||
        err.response?.data ||
        String(err)
    });
  }

  return;
}







  },
}));
