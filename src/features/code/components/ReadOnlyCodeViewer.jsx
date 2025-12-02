export const ReadOnlyCodeViewer = ({ code, language = 'java' }) => {
    return (
        <div className="code-viewer">
            <div className="viewer-header">강사 코드</div>
            <CodeEditor code={code} readOnly={true} language={language} />
        </div>
    );
};