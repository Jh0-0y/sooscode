import {useEffect, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { SocketProvider, useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import {ClassroomProvider, useClassroom} from "@/features/classroom/contexts/ClassroomContext.jsx";
import { useSidebar } from "@/features/classroom/hooks/class/useSidebar.js";
import {decodeNumber} from "@/utils/urlEncoder.js";
import ClassHeader from "./ClassHeader.jsx";
import ClassSidebar from "./ClassSidebar.jsx";
import ClassBody from "./ClassBody.jsx";
import styles from './ClassroomPage.module.css';

const ClassroomPage = () => {
    const { encodedId } = useParams();
    const navigate = useNavigate();

    const classId = useMemo(() => {
        try {
            return decodeNumber(encodedId);
        } catch {
            return null;
        }
    }, [encodedId]);

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
            <SocketProvider classId={classId}>
                <ClassroomContent />
            </SocketProvider>
        </ClassroomProvider>
    );
};

const ClassroomContent = () => {
    const { collapsed, toggle } = useSidebar();
    const { connected } = useSocketContext();
    const { classId } = useClassroom();

    useEffect(() => {
        if (connected) {
            console.log('[ClassroomPage] 웹소켓 연결 완료, classId:', classId);
        }
    }, [connected, classId]);

    return (
        <div className={styles.container}>
            {/* 고정 헤더 */}
            <ClassHeader />

            {/* 사이드바 토글 버튼 */}
            <button
                className={styles.toggleBtn}
                style={{ left: collapsed ? "0px" : "299px" }}
                onClick={toggle}>
                {collapsed ? '›' : '‹'}
            </button>

            {/* 사이드바 */}
            <ClassSidebar />

            {/* 스크롤 영역 */}
            <ClassBody />
        </div>
    );
};

export default ClassroomPage;