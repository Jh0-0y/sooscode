import styles from './ClassSidebar.module.css';
import { useState } from "react";
import { useSidebar } from "@/features/classroom/hooks/class/useSidebar.js";
import { useParticipants } from "@/features/classroom/hooks/class/useParticipants.js";
import { useSelectedStudent } from "@/features/classroom/hooks/class/useSelectedStudent.js"; // ✅ 추가
import { useUser } from "@/hooks/useUser.js"; // ✅ 추가
import { useParams } from "react-router-dom";
import { decodeNumber } from "@/utils/urlEncoder";
import ChatPanel from "@/features/classroom/components/chat/ChatPanel.jsx";

const ClassSidebar = () => {
    const { collapsed } = useSidebar();
    const [activeTab, setActiveTab] = useState('students');
    const { encodedId } = useParams();
    const classId = decodeNumber(encodedId);
    const { user } = useUser();
    // 실시간 참가자 목록
    const { students, instructors, totalCount } = useParticipants(classId);

    //
    const { selectedStudent, selectStudent } = useSelectedStudent();

    // 강사 여부 확인
    const isInstructor = user?.role === 'INSTRUCTOR';

    //
    const handleStudentClick = (student) => {
        if (!isInstructor) return; // 강사만 선택 가능

        selectStudent({
            userId: student.userId,
            username: student.username,
            userEmail: student.userEmail || `user${student.userId}@temp.com`, // 임시 이메일
        });

        console.log('[ClassSidebar] 학생 선택:', student);
    };

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
                            학생 목록 ({students.length})
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
                            onClick={() => setActiveTab('chat')}
                        >
                            채팅
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
                            <div className={styles.participantSection}>
                                {/* 강사 목록 */}
                                {instructors.length > 0 && (
                                    <div className={styles.participantGroup}>
                                        <h4 className={styles.groupTitle}>
                                            👨‍🏫 강사 ({instructors.length})
                                        </h4>
                                        <div className={styles.studentList}>
                                            {instructors.map((instructor) => (
                                                <div
                                                    key={instructor.userId}
                                                    className={`${styles.studentItem} ${styles.instructor}`}
                                                >
                                                    <div className={styles.participantInfo}>
                                                        <div className={styles.participantName}>
                                                            {instructor.username}
                                                        </div>
                                                        <div className={styles.participantStatus}>
                                                            {instructor.isOnline ? (
                                                                <span className={styles.onlineBadge}>●</span>
                                                            ) : (
                                                                <span className={styles.offlineBadge}>○</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 학생 목록 */}
                                <div className={styles.participantGroup}>
                                    <h4 className={styles.groupTitle}>
                                        👥 학생 ({students.length})
                                    </h4>
                                    {students.length > 0 ? (
                                        <div className={styles.studentList}>
                                            {students.map((student) => (
                                                <div
                                                    key={student.userId}
                                                    className={`
                                                        ${styles.studentItem} 
                                                        ${isInstructor ? styles.clickable : ''}
                                                        ${selectedStudent?.userId === student.userId ? styles.selected : ''}
                                                    `}
                                                    onClick={() => handleStudentClick(student)}
                                                >
                                                    <div className={styles.participantInfo}>
                                                        <div className={styles.participantName}>
                                                            {student.username}
                                                        </div>
                                                        <div className={styles.participantStatus}>
                                                            {student.isOnline ? (
                                                                <span className={styles.onlineBadge}>●</span>
                                                            ) : (
                                                                <span className={styles.offlineBadge}>○</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.emptyMessage}>
                                            접속한 학생이 없습니다
                                        </div>
                                    )}
                                </div>

                                {/* 전체 인원 */}
                                <div className={styles.totalCount}>
                                    총 {totalCount}명 접속 중
                                    {isInstructor && selectedStudent && (
                                        <div className={styles.selectedInfo}>
                                            선택: {selectedStudent.username}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'chat' && (
                            <ChatPanel/>
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