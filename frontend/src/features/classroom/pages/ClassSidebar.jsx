import { useState } from "react";
import styles from './ClassSidebar.module.css';
import { useSidebar } from "@/features/classroom/hooks/class/useSidebar.js";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import StudentListPanel from "@/features/classroom/components/class/StudentListPanel.jsx";
import ChatPanel from "@/features/classroom/components/chat/ChatPanel.jsx";

/**
 * 클래스룸 사이드바
 * - 학생 목록 탭
 * - 채팅 탭
 */
const ClassSidebar = () => {
    const { collapsed } = useSidebar();
    const { studentCount } = useSocketContext();
    const [activeTab, setActiveTab] = useState('students');

    return (
        <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles.sidebarContent}>
                {/* 탭 버튼 */}
                <div className={styles.sidebarTabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'students' ? styles.active : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        학생 목록 ({studentCount})
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        채팅
                    </button>
                </div>

                {/* 탭 컨텐츠 */}
                <div className={styles.tabContent}>
                    {activeTab === 'students' && <StudentListPanel />}
                    {activeTab === 'chat' && <ChatPanel />}
                </div>
            </div>
        </div>
    );
};

export default ClassSidebar;