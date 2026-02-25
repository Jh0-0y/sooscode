import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styles from './ClassBody.module.css';
import { useSidebar } from "@/features/classroom/hooks/class/useSidebar.js";
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import SnapshotPanel from "@/features/classroom/components/snapshot/SnapshotPanel.jsx";
import CodePanel from "@/features/classroom/components/code/CodePanel.jsx";
import CodeSharePanel from "@/features/classroom/components/code/CodeSharePanel.jsx";
import TopButtonBar from "@/features/classroom/components/code/TopButtonBar.jsx";
import LivekitVideo from "@/features/classroom/components/livekit/LivekitVideo.jsx";
import SnapshotSaveFeature from "@/features/classroom/components/snapshot/SnapshotSaveFeature.jsx";

/**
 * 클래스룸 메인 바디
 *
 * 구조:
 * - 좌측: CodePanel (내 코드 작성)
 * - 우측: CodeSharePanel (읽기 전용) / SnapshotPanel (탭)
 */
const ClassBody = () => {
    const { collapsed } = useSidebar();
    const { isInstructor } = useClassroomContext();
    const [activeTab, setActiveTab] = useState('code');
    const [currentCode, setCurrentCode] = useState('');
    const handleRestore = (code) => {
        setCurrentCode(code);
    };

    // 우측 패널 라벨
    const getRightPanelLabel = () => {
        return isInstructor ? '학생 코드' : '강사 코드';
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
                    <PanelGroup direction="horizontal">
                        {/* 왼쪽 패널 - 내 코드 */}
                        <Panel defaultSize={50} minSize={20} maxSize={80}>
                            <div className={`${styles.inner} ${styles.left}`}>
                                <div className={styles.tabContainer}>
                                    {isInstructor ? (
                                        <TopButtonBar />
                                    ) : (
                                        <div className={styles.snapButtoncontainer}>
                                            <SnapshotSaveFeature code={currentCode}/>
                                        </div>
                                    )}
                                </div>
                                <CodePanel code={currentCode}
                                           onCodeChange={setCurrentCode}/>
                            </div>
                        </Panel>

                        {/* 리사이즈 핸들 */}
                        <PanelResizeHandle className={styles.resizer}>
                            <div className={styles.resizerInner} />
                        </PanelResizeHandle>

                        {/* 오른쪽 패널 - 읽기 전용 코드 / 스냅샷 */}
                        <Panel defaultSize={50} minSize={20} maxSize={80}>
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
                                    <SnapshotPanel onRestore={handleRestore}/>
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </div>
            </div>
        </div>
    );
};

export default ClassBody;