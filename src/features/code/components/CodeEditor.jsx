// CodeEditor.jsx - 편집 가능한 에디터
import { Editor } from '@monaco-editor/react';

export const CodeEditor = ({
                               code,
                               onChange,
                               language = 'java',
                               readOnly = false,
                               placeholder = '코드를 입력하세요...'
                           }) => {
    return (
        <div className="code-editor-container">
            <Editor
                height="500px"
                language={language}
                value={code}
                onChange={onChange}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14
                }}
                theme="vs-dark"
            />
        </div>
    );
};