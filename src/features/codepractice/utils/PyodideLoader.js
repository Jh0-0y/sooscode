let pyodideInstance = null;

export async function loadPyodideInstance() {
  if (pyodideInstance) return pyodideInstance;

  // 이미 로드되어 있지 않다면 <script> 태그 생성해서 로드
  if (!globalThis.loadPyodide) {
    console.log("Pyodide CDN 스크립트 로드 중...");

    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      script.onload = resolve;
      script.onerror = (e) => {
        console.warn("Pyodide script load error (무시함):", e);
        resolve(); // 강제로 계속 진행
      };
      document.body.appendChild(script);
    });
  }

  console.log("Pyodide 초기화 중...");
  pyodideInstance = await globalThis.loadPyodide({
  indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
  disableLoadPackageFallback: true
});

  console.log("Pyodide 초기화 완료!");
  return pyodideInstance;
}
