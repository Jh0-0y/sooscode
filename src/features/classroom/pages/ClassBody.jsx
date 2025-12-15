import { useState } from 'react';
import styles from './ClassBody.module.css';
import { useSidebar } from "@/features/classroom/hooks/class/useSidebar.js";
import { useUser } from "@/hooks/useUser.js";
import { useResize } from "@/features/classroom/hooks/class/useResize.js";
import SnapshotPanel from "@/features/classroom/components/snapshot/SnapshotPanel.jsx";
import CodePanel from "@/features/classroom/components/code/CodePanel.jsx";
import CodeSharePanel from "@/features/classroom/components/code/CodeSharePanel.jsx";
import LivekitVideo from "@/features/classroom/components/livekit/LivekitVideo.jsx";

const ClassBody = () => {
    const { collapsed } = useSidebar();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('code');
    const { targetRef: leftRef, startResize } = useResize();

    // 권한 별 다른 글씨
    const isInstructor = user?.role === 'INSTRUCTOR';
    const isStudent = user?.role === 'STUDENT';

    const getRightPanelLabel = () => {
        if (isInstructor) return '학생 코드';
        if (isStudent) return '강사 코드';
        return '학생 코드';
    };

    return (
        <div
            className={styles.scrollArea}
            style={{ left: collapsed ? "0px" : "300px" }}
        >
            {/* 라이브킷 영역 */}
            <div className={styles.page}>
                <div className={styles.content}>
                    <div className={styles.inner}>
                        <LivekitVideo />
                    </div>
                </div>
            </div>

            {/* 코드 영역 */}
            <div className={styles.page}>
                <div className={styles.content}>
                    {/* 왼쪽 패널 */}
                    <div className={`${styles.inner} ${styles.left}`} ref={leftRef}>
                        <button className={styles.tab}>내 코드</button>
                        <CodePanel />
                    </div>

                    {/* 리사이즈 바 */}
                    <div className={styles.resizer} onMouseDown={startResize}>
                        <div className={styles.dotWrap} />
                    </div>

                    {/* 오른쪽 패널 */}
                    <div className={`${styles.inner} ${styles.right}`}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'code' ? styles.active : ''}`}
                                onClick={() => setActiveTab('code')}
                            >
                                {getRightPanelLabel()}
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'snapshot' ? styles.active : ''}`}
                                onClick={() => setActiveTab('snapshot')}
                            >
                                스냅샷
                            </button>
                        </div>
                        <div
                            className={styles.panel}
                            style={{ display: activeTab === 'code' ? 'block' : 'none' }}
                        >
                            <CodeSharePanel />
                        </div>
                        <div
                            className={styles.panel}
                            style={{ display: activeTab === 'snapshot' ? 'block' : 'none' }}
                        >
                            <SnapshotPanel />
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassBody;