import styles from './Classroom.module.css';

import ClassHeader from "@/features/classroom/layouts/ClassHeader.jsx";
import ClassSidebar from "@/features/classroom/layouts/ClassSidebar.jsx";
import {useSidebar} from "@/features/classroom/hooks/useSidebar.js";
import {useEffect} from "react";
import useSocket from "@/features/classroom/hooks/useSocket.js";
import ClassBody from "@/features/classroom/layouts/ClassBody.jsx";
import {useClass} from "@/features/classroom/hooks/useClass.js";

const Classroom = ({/*classId*/}) => {
    const { collapsed, toggle } = useSidebar();
    const { fetchClassroom } = useClass();
    const classId = 1;
    const socket = useSocket(classId);

    useEffect(() => {
        fetchClassroom(classId);
    }, [classId]);


    useEffect(() => {
        if (socket.connected) {
            console.log('[Classroom] 웹소켓 연결 완료, classId:', classId);
        }
    }, [socket.connected, classId]);

    return (
        <div className={styles.container}>

            {/* 고정 헤더 */}
            <ClassHeader
                className="웹 프로그래밍 기초"
                status="live"
                participantCount={24}
                totalParticipants={30}
                isInstructor={true}
            />

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

export default Classroom;