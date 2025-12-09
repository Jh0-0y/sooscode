// features/classroom/layouts/ClassBody.jsx
import { useState } from 'react';
import styles from './ClassBody.module.css';
import { useSidebar } from "@/features/classroom/hooks/useSidebar.js";

const ClassBody = ({ isInstructor = false }) => {
    const { collapsed } = useSidebar();
    const [activeTab, setActiveTab] = useState('snapshot');

    return (
        <div
            className={styles.scrollArea}
            style={{ left: collapsed ? "0px" : "300px" }}
        >
            {/* 라이브킷 영역 */}
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.inner}>
                        라이브킷
                        {/*<LiveKitPanel />*/}
                    </div>
                </div>
            </div>

            {/* 코드 영역 */}
            <div className={styles.page}>
                <div className={styles.content}>
                    {/* 내 코드 */}
                    <div className={styles.inner}>
                        코드
                        {/*<CodePanel />*/}
                    </div>

                    {/* 스냅샷 / 코드쉐어 탭 */}
                    <div className={styles.inner}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'snapshot' ? styles.active : ''}`}
                                onClick={() => setActiveTab('snapshot')}
                            >
                                스냅샷
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'code' ? styles.active : ''}`}
                                onClick={() => setActiveTab('code')}
                            >
                                학생 코드 / 강사 코드
                            </button>
                        </div>

                        <div className={styles.tabContent}>
                            {activeTab === 'snapshot' && (
                                <div className={styles.panel}>
                                    스냅샷 패널
                                    {/*<SnapshotPanel />*/}
                                </div>
                            )}
                            {activeTab === 'code' && (
                                <div className={styles.panel}>
                                    코드 쉐어 패널
                                    {/*<CodeSharePanel />*/}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassBody;