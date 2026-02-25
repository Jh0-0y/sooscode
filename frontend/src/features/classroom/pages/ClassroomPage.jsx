import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClassroomProvider, useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { SocketProvider, useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import { useSidebar } from "@/features/classroom/hooks/class/useSidebar.js";
import { decodeNumber } from "@/utils/urlEncoder.js";
import ClassHeader from "./ClassHeader.jsx";
import ClassSidebar from "./ClassSidebar.jsx";
import ClassBody from "./ClassBody.jsx";
import styles from './ClassroomPage.module.css';

/**
 * 클래스룸 페이지
 *
 * Context 구조:
 * ClassroomProvider (classId, userId, username, isInstructor)
 * └── SocketProvider (isConnected, participants, students, classMode)
 *     └── ClassroomContent
 *         ├── ClassHeader
 *         ├── ClassSidebar (채팅, 학생목록)
 *         └── ClassBody (코드 에디터, 뷰어)
 */
const ClassroomPage = () => {
    const { encodedId } = useParams();
    const navigate = useNavigate();

    // URL에서 classId 디코딩
    const classId = useMemo(() => {
        try {
            return decodeNumber(encodedId);
        } catch {
            return null;
        }
    }, [encodedId]);

    // 유효하지 않은 classId면 404
    useEffect(() => {
        if (classId === null) {
            navigate('/error/404', { replace: true });
        }
    }, [classId, navigate]);

    if (classId === null) {
        return null;
    }

    return (
        <ClassroomProvider classId={classId}>
            <SocketProvider>
                <ClassroomContent />
            </SocketProvider>
        </ClassroomProvider>
    );
};

/**
 * 클래스룸 컨텐츠
 * - Context에서 필요한 값들 사용
 */
const ClassroomContent = () => {
    const { collapsed, toggle } = useSidebar();
    const { classId, isInstructor } = useClassroomContext();
    const { isConnected, studentCount } = useSocketContext();

    useEffect(() => {
        if (isConnected) {
            console.log('[ClassroomPage] 연결 완료', {
                classId,
                isInstructor,
                studentCount,
            });
        }
    }, [isConnected, classId, isInstructor, studentCount]);

    return (
        <div className={styles.container}>
            {/* 고정 헤더 */}
            <ClassHeader />

            {/* 사이드바 토글 버튼 */}
            <button
                className={styles.toggleBtn}
                style={{ left: collapsed ? "0px" : "299px" }}
                onClick={toggle}
            >
                {collapsed ? '›' : '‹'}
            </button>

            {/* 사이드바 */}
            <ClassSidebar />

            {/* 메인 영역 */}
            <ClassBody />
        </div>
    );
};

export default ClassroomPage;