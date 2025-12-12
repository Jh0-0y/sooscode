// features/classroom/layouts/ClassBody.jsx
import {useRef, useState} from 'react';
import styles from './ClassBody.module.css';
import {useSidebar} from "@/features/classroom/hooks/useSidebar.js";
import SnapshotPanel from "@/features/snapshot/components/SnapshotPanel.jsx";
import CodePanel from "@/features/code/CodePanel.jsx";
import {useCode} from "@/features/code/hooks/useCode.js";
import CodeSharePanel from "@/features/code/CodeSharePanel.jsx";

function CodeShare() {
    return null;
}

const ClassBody = ({isInstructor = false, classId, socket}) => {
    const {collapsed} = useSidebar();
    const {editorInstance} = useCode();
    const [activeTab, setActiveTab] = useState('snapshot');

    /**
     * 영역 조정
     */
    const leftRef = useRef();

    const startResize = (e) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
    };

    const handleResize = (e) => {
        const containerLeft = leftRef.current.parentElement.getBoundingClientRect().left;

        const newWidth = e.clientX - containerLeft; // 마우스 x기준으로 사이즈 조절
        leftRef.current.style.width = `${newWidth}px`;

        // 에디터 다시 레이아웃
        if (editorInstance) editorInstance.layout();
    };

    const stopResize = () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
    };


    return (
        <div
            className={styles.scrollArea}
            style={{left: collapsed ? "0px" : "300px"}}
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

                    {/* 왼쪽 패널 */}
                    <div className={`${styles.inner} ${styles.left}`} ref={leftRef}>
                        <button className={styles.tab}> 내 코드</button>
                        <CodePanel  socket={socket} classId={classId} />
                    </div>


                    {/* 리사이즈 바 */}
                    <div className={styles.resizer} onMouseDown={startResize}>
                        <div className={styles.dotWrap}/>
                    </div>

                    {/* 오른쪽 패널 */}
                    <div className={`${styles.inner} ${styles.right}`}>
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

                        <div
                            className={styles.panel}
                            style={{display: activeTab === 'snapshot' ? 'block' : 'none'}}
                        >
                            <SnapshotPanel />
                        </div>

                        <div
                            className={styles.panel}
                            style={{display: activeTab === 'code' ? 'block' : 'none'}}
                        >
                            <CodeSharePanel socket={socket} classId={classId}/>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClassBody;