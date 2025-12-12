// common/components/classroom/CodeEditor.jsx
import { PlayIcon } from '@/common/components/utils/Icons';
import styles from './CodePanel.module.css';

const CodeEditor = ({ 
    title, 
    code, 
    onChange, 
    readOnly = false, 
    onRun,
    showRunButton = false 
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                {showRunButton && onRun && (
                    <button className={styles.runButton} onClick={onRun}>
                        <PlayIcon />
                        실행
                    </button>
                )}
            </div>
            <div className={styles.editorWrapper}>
                <textarea
                    className={`${styles.editor} ${readOnly ? styles.readOnly : ''}`}
                    value={code}
                    onChange={(e) => onChange?.(e.target.value)}
                    readOnly={readOnly}
                    spellCheck={false}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
