// common/components/classroom/OutputPanel.jsx
import styles from './OutputPanel.module.css';

const OutputPanel = ({ output, label = '실행 결과' }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>{label}</span>
            </div>
            <pre className={styles.output}>
                {output || '실행 결과가 여기에 표시됩니다.'}
            </pre>
        </div>
    );
};

export default OutputPanel;
