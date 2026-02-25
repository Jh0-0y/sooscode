let pyodideInstance = null;

export async function loadPyodideInstance() {
  // pyodideInstance 객체를 통해서 method 사용
  if (pyodideInstance) return pyodideInstance;

  // pyodide 스크립트가 이미 로드된 상태인지 체크
  if (!globalThis.loadPyodide) {
    console.log("Pyodide CDN 스크립트 로드 중...");

    // script 태그는 로드까지 시간이 필요
    await new Promise((resolve, reject) => {
      // react에서는 HTML에 직접 <script>를 삽입할 수 없기 때문에 동적으로 script 추가
      const script = document.createElement("script");
      // 브라우저가 pyodide.js 파일 다운로드
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      // 다운로드 성공시 전역에 loadPyodide() 추가
      script.onload = resolve;
      // script load 성공시 promise가 resolve가 되어서 await 실행
      script.onerror = (e) => {
        // 현재 에러 막아줘야하는데 에러뜨면 진행이 안되서 error설정안함
        console.warn("Pyodide script load error (무시함):", e);
        console.log(reject);
        resolve(); // 강제로 계속 진행
      };
      // <script src="pyodide.js"> 를 HTML에 집어넣는 것과 동일 효과
      document.body.appendChild(script);
    });
  }

  console.log("Pyodide 초기화 중...");
  // loadPyodide 초기화를 대기하고 성공시 pyodideInstance 생성
  // 이후 pyodideInstance 객체를 통해서 함수 실행
  pyodideInstance = await globalThis.loadPyodide({
  indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
  disableLoadPackageFallback: true,
  
  
});

  console.log("Pyodide 초기화 완료!");
  return pyodideInstance;
}
