import {useState} from "react";

export const CodeExecutor = ({ code, onExecute }) => {
    const [result, setResult] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);

    const handleExecute = async () => {
        setIsExecuting(true);
        try {
            const response = await onExecute(code);
            setResult(response);
        } catch (error) {
            setResult(`에러: ${error.message}`);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="code-executor">
            <button onClick={handleExecute} disabled={isExecuting}>
                {isExecuting ? '실행 중...' : '코드 실행'}
            </button>
            {result && (
                <div className="execution-result">
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
};