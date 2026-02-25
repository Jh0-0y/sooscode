import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import { useSelectedStudent } from "@/features/classroom/hooks/class/useSelectedStudent.js";
import styles from './StudentListPanel.module.css';

/**
 * 학생/강사 목록 패널
 * - 실시간 참여자 목록 표시
 * - 강사: 학생 클릭 시 CodeSharePanel에 해당 학생 코드 표시
 */
const StudentListPanel = () => {
    const { isInstructor } = useClassroomContext();
    const { participants, students, studentCount, totalCount } = useSocketContext();
    const { selectedStudent, selectStudent } = useSelectedStudent();

    // 강사 목록 필터링
    const instructors = participants.filter(p => p.instructor);

    // 학생 클릭 핸들러
    const handleStudentClick = (student) => {
        if (!isInstructor) return;

        selectStudent({
            userId: student.userId,
            username: student.username,
            userEmail: student.userEmail || null,
        });

        console.log('[StudentListPanel] 학생 선택:', student.username);
    };

    return (
        <div className={styles.participantSection}>
            {/* 강사 목록 */}
            {instructors.length > 0 && (
                <div className={styles.participantGroup}>
                    <h4 className={styles.groupTitle}>
                        강사 ({instructors.length})
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 학생 목록 */}
            <div className={styles.participantGroup}>
                <h4 className={styles.groupTitle}>
                    학생 ({studentCount})
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
    );
};

export default StudentListPanel;