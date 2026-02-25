// codepractice/codingtest/judge.js

/**
 * 🔒 사용자 코드 검증 (1차 방어선)
 * - import / require
 * - 네트워크 / 워커 탈출
 * - 블로킹 API
 */
function validateCode(userCode) {
  const bannedPatterns = [
    /\bimport\b/,                 // import, import()
    /\brequire\s*\(/,             // require()
    /\bfetch\s*\(/,               // fetch
    /\bXMLHttpRequest\b/,          // xhr
    /\bWebSocket\b/,               // websocket
    /\bSharedArrayBuffer\b/,       // shared memory
    /\bAtomics\b/,                 // atomics.wait
    /\bimportScripts\b/,           // worker script load
    /\bglobalThis\b/,              // global escape
    /\bself\b/,                    // worker self 접근
  ];

  for (const pattern of bannedPatterns) {
    if (pattern.test(userCode)) {
      throw new Error("허용되지 않은 코드가 포함되어 있습니다.");
    }
  }
}

/**
 * 단일 테스트 실행 (Run 버튼)
 */
export function runUserCode(userCode, input) {
  try {
    // 🔒 코드 검증
    validateCode(userCode);

    const wrappedCode = `
      "use strict";
      ${userCode}
      return solution(${JSON.stringify(input)});
    `;

    const fn = new Function(wrappedCode);
    const result = fn();

    return {
      success: true,
      output: String(result),
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

/**
 * 전체 테스트 실행 (Submit 버튼 - 단순 비교)
 */
export function judgeAll(userCode, testCases) {
  try {
    validateCode(userCode);
  } catch (e) {
    return testCases.map((tc, index) => ({
      index,
      input: tc.input,
      pass: false,
      error: e.message,
    }));
  }

  return testCases.map((tc, index) => {
    const result = runUserCode(userCode, tc.input);

    if (!result.success) {
      return {
        index,
        input: tc.input,
        pass: false,
        error: result.error,
      };
    }

    return {
      index,
      input: tc.input,
      expected: tc.output,
      actual: result.output,
      pass: result.output === tc.output,
    };
  });
}

/**
 * JS 전용 채점기 (Submit 버튼 - 권장)
 */
export function judgeJS(userCode, testCases) {
  const results = [];

  try {
    // 🔒 코드 검증
    validateCode(userCode);

    // solution 함수 컴파일
    const fn = new Function(`
      "use strict";
      ${userCode}
      return solution;
    `)();

    for (let i = 0; i < testCases.length; i++) {
      const { input, output } = testCases[i];

      let result;
      try {
        result = fn(input);
      } catch (e) {
        results.push({
          index: i + 1,
          input,
          expected: output,
          result: "Runtime Error",
          pass: false,
          
        });
        console.log(e)
        continue;
      }

      results.push({
        index: i + 1,
        input,
        expected: output,
        result,
        pass: Object.is(String(result), String(output)),
      });
    }
  } catch (e) {
    return {
      error: e.message || "컴파일 에러",
      results: [],
    };
  }

  return { results };
}
