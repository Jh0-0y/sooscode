import { create } from "zustand";
import { loadPyodideInstance } from "../utils/PyodideLoader";
import { runJavaCode } from "../services/compile/compile.api";

import { DEFAULT_SNIPPETS } from "@/features/codepractice/constants/defaultSnippets";

let pythonWorker = null;

function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export const usePracticeStore = create((set, get) => ({
  /* default snippets */ 
  code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  language: "JAVA",
  output: "",
  htmlCode: `<div id="app">
                <h1>Hello HCJ!</h1>
                <button id="btn">Click Me</button>
            </div>`,
  cssCode: `body {
            margin: 0;
            padding: 20px;
            background: #1e1e1e;
            color: #ffffff;
            font-family: Arial, sans-serif;
          }

          #app {
            padding: 20px;
            border: 2px solid #fff;
            border-radius: 8px;
          }

          button {
            padding: 8px 16px;
            background: #4da3ff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }`,
  jsCode: `document.getElementById("btn").addEventListener("click", () => {
  console.log("JS is working!");
  alert("JS 실행됨!");
  });`,
  classId: null,
  classTitle:"강의가 선택되지 않았습니다.",
  isRunning: false,
  

  /* Store Sets */
  setCode: (val) => set({ code: val }),
  setLanguage: (lang) => {
    if (lang === "CSS_HTML_JS") {
      set({ language: "CSS_HTML_JS" });
    } else {
      set({ language: lang });
    }
  },
  setOutput: (data) => set({ output: data }),
  resetCode: () => set({
     code: "" ,
     htmlCode: "",
    cssCode: "",
    jsCode: "",
    }),
  consoleOutput: "",
  setConsoleOutput: (v) => set({ consoleOutput: v }),
  clearConsole: () => set({ consoleOutput: "" }),
  renderHTML: "",
  setRenderHTML: (v) => set({ renderHTML: v }),
  //HCJ set 등록
  setHTML: (v) => set({ htmlCode: v }),
  setCSS: (v) => set({ cssCode: v }),
  setJS: (v) => set({ jsCode: v }),
  resetHCJ: () => set({
    htmlCode: "",
    cssCode: "",
    jsCode: "",
  }),
  resetHCJToDefault: () => {
  const hcj = DEFAULT_SNIPPETS.CSS_HTML_JS;
  set({
    htmlCode: hcj.html,
    cssCode: hcj.css,
    jsCode: hcj.js,
  });
  },
  setClassId : (v) => set({ classId:v }),
  setClassTitle : (v) => set({classTitle:v}),
  

  /* Header Action */
  run: async () => {
    const { code, language ,htmlCode, cssCode, jsCode} = get();
    if (get().isRunning) return;
     if (language === "PYTHON") {
      if (!pythonWorker) {
        pythonWorker = new Worker(
          new URL("../worker/pythonWorker.js", import.meta.url)
        );
      }

      set({ isRunning: true, output: "실행 중..." });

      pythonWorker.onmessage = (e) => {
        const { type, output, error } = e.data;

        if (type === "RESULT") {
          set({ output });
        }

        if (type === "ERROR") {
          set({ output: error });
        }

        set({ isRunning: false });
      };

      pythonWorker.postMessage({ code });
      return;
    }

    if (language === "JAVA") {
      console.log("java 컴파일러 실행");

      set({ isRunning: true, output: "실행 중..." });

      const result = await runJavaCode({ code: encodeBase64(code) });
          console.log(result)
      if (result.success) {
        set({ output: result.output });
      } else {
        set({ output: result.output });
      }

      set({ isRunning: false });
      return;
    }

    if (language === "CSS_HTML_JS") {
      console.log("HCJ render 실행");
      const safeJS = JSON.stringify(jsCode);
      // iframe으로 렌더링 → 코드 프리뷰 영역에서 subscribe 해서 보기
      
      console.log("=== RUN 실행 ===");
      console.log("HCJ render 실행");
      console.log("language:", language);

      
      const fullHTML = `
<html>
  <head>
    <style>${cssCode}</style>
  </head>
  <body>
    ${htmlCode}
    <script>
try {
    const realLog = console.log;
    console.log = function(...args) {
        parent.postMessage({ type: "HCJ_LOG", message: args.join(" ") }, "*");
        realLog.apply(console, args);
    };

    eval(${safeJS});

} catch(e) {
    parent.postMessage({ type: "HCJ_ERROR", message: e.message }, "*");
}
</script>
  </body>
</html>
`;



      set({
  consoleOutput: "",
  renderHTML: fullHTML,
});


      return;
    }
    console.log("hello1");
  },
}));
