// features/classroom/hooks/code/useCodeExecution.js

import { useState } from 'react';
import { api } from "@/services/api.js";
import { executeCode, copyCode as copyCodeUtil } from "@/features/classroom/utils/editorUtils.js";

/**
 * 코드 실행 및 출력 관리 훅
 *
 * 동작 정책:
 * - run() 호출 시 버튼 비활성화
 * - 실행 결과(output)가 실제로 도착한 이후에만 버튼 활성화
 */
export const useCodeExecution = (code) => {
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [hasResult, setHasResult] = useState(true);

    const run = async () => {
        // 실행 중이거나, 아직 이전 결과가 처리 중이면 차단
        setHasResult(false);
        if (isRunning) return;

        setIsRunning(true);
        setOutput("실행 중...");

        try {
            const result = await executeCode(code, api);
            setOutput(result.output);
            setHasResult(true);

        } catch (error) {
            setOutput("실행 중 오류가 발생했습니다.");
            setHasResult(true); // 오류도 결과로 간주
        } finally {
            setIsRunning(false);
        }
    };

    const copy = () => {
        copyCodeUtil(code);
    };

    const clearOutput = () => {
        setOutput("");
        setHasResult(false);
    };

    return {
        output,
        isRunning,
        hasResult,
        run,
        copy,
        clearOutput,
    };
};