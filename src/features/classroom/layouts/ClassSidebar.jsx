import styles from './ClassSidebar.module.css';
import { useState } from "react";
import {useSidebar} from "@/features/classroom/hooks/useSidebar.js";

const ClassSidebar = () => {
    const { collapsed } = useSidebar();
    const [activeTab, setActiveTab] = useState('students');

    return (
        <>

            {/* 사이드바 */}
            <div
                className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
            >
                <div className={styles.sidebarContent}>

                    {/* 탭 버튼 */}
                    <div className={styles.sidebarTabs}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'students' ? styles.active : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            학생 목록
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
                            onClick={() => setActiveTab('chat')}
                        >
                            채팅
                            {/*<ChatPanel />*/}
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'files' ? styles.active : ''}`}
                            onClick={() => setActiveTab('files')}
                        >
                            파일
                        </button>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className={styles.tabContent}>
                        {activeTab === 'students' && (
                            <div className={styles.studentList}>
                                <div className={styles.studentItem}>학생 1</div>
                                <div className={styles.studentItem}>학생 2</div>
                                <div className={styles.studentItem}>학생 3</div>
                            </div>
                        )}
                        {activeTab === 'chat' && (
                            <div className={styles.chatArea}>
                                <p>채팅 내용이 여기 표시됩니다</p>
                            </div>
                        )}
                        {activeTab === 'files' && (
                            <div className={styles.fileList}>
                                <p>파일이 여기 표시됩니다</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClassSidebar;