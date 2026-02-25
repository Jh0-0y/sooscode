import { judgeJS, runUserCode } from "./judge";

self.onmessage = (e) => {
  const { userCode, testCases, mode } = e.data;

  try {
    if (mode === "run") {
      const result = runUserCode(userCode, testCases[0].input);
      self.postMessage({ success: true, result });
    }

    if (mode === "submit") {
      const results = judgeJS(userCode, testCases);
      self.postMessage({ success: true, results });
    }
  } catch (err) {
    self.postMessage({
      success: false,
      error: err.message,
    });
  }
};
