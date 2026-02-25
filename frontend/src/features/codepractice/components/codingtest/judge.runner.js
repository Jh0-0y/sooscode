let worker = null;

export function runInWorker(payload, timeout = 5000) {
  if (!worker) {
    worker = new Worker(
      new URL("./judge.worker.js", import.meta.url),
      { type: "module" }
    );
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      worker.terminate();
      worker = null;
      reject(new Error("Time Limit Exceeded"));
    }, timeout);

    worker.onmessage = (e) => {
      clearTimeout(timer); // 성공 시 타이머 해제
      resolve(e.data);
    };

    worker.onerror = (e) => {
      clearTimeout(timer);
      reject(e);
    };

    // 워커 실행 시작
    worker.postMessage(payload);
  });
}
