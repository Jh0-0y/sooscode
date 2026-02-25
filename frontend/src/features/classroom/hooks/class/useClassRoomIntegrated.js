import { useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useClassRoom } from './useClassRoom';
import {
    useInstructorCode,
    useStudentCodeSender,
    useInstructorCodeSender,
    useStudentCodeViewer
} from '../code/useCode.js';
import { useChat } from '../chat/useChat.js';

/**
 * 학생용 통합 클래스룸 훅
 * - WebSocket 연결
 * - 클래스 입장/퇴장
 * - 강사 코드 수신
 * - 내 코드 전송
 * - 채팅
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {function} options.onClassEnd - 수업 종료 콜백
 * @param {function} options.onKicked - 강퇴당함 콜백
 */
export const useStudentClassRoom = ({
                                        classId,
                                        onClassEnd,
                                        onKicked,
                                    } = {}) => {
    // WebSocket 연결
    const { isConnected, isConnecting, disconnect } = useWebSocket({
        isInstructor: false,
        autoConnect: true,
    });

    // 클래스룸 관리
    const classroom = useClassRoom({
        classId,
        isConnected,
        onClassEnd,
        onKicked,
    });

    // 강사 코드 수신
    const instructorCode = useInstructorCode({
        classId,
        isConnected,
        enabled: true,
    });

    // 내 코드 전송
    const { sendCode } = useStudentCodeSender({
        classId,
        isConnected,
        debounceDelay: 300,
    });

    // 채팅
    const chat = useChat({
        classId,
        isConnected,
    });

    // 리액션
    const reaction = useChatReaction({
        classId,
        isConnected,
    });

    // 타이핑
    const typing = useTyping({
        classId,
        isConnected,
    });

    // 퇴장 처리
    const leave = useCallback(() => {
        classroom.leaveClass();
        disconnect();
    }, [classroom, disconnect]);

    return {
        // 연결 상태
        isConnected,
        isConnecting,
        isJoined: classroom.isJoined,

        // 클래스 정보
        participants: classroom.participants,
        studentCount: classroom.studentCount,
        classMode: classroom.classMode,

        // 강사 코드
        instructorCode: instructorCode.code,
        instructorLanguage: instructorCode.language,

        // 내 코드 전송
        sendCode,

        // 채팅
        messages: chat.messages,
        sendMessage: chat.sendMessage,
        deleteMessage: chat.deleteMessage,

        // 리액션
        toggleReaction: reaction.toggleReaction,
        myReactions: reaction.myReactions,

        // 타이핑
        typingUsers: typing.typingUsers,
        onTypingKeyDown: typing.onKeyDown,

        // 액션
        leave,
    };
};

/**
 * 강사용 통합 클래스룸 훅
 * - WebSocket 연결
 * - 클래스 입장/퇴장
 * - 내 코드 전송
 * - 학생 코드 보기
 * - 채팅
 * - 수업 관리
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {function} options.onClassEnd - 수업 종료 콜백
 */
export const useInstructorClassRoom = ({
                                           classId,
                                           onClassEnd,
                                       } = {}) => {
    // WebSocket 연결
    const { isConnected, isConnecting, disconnect } = useWebSocket({
        isInstructor: true,
        autoConnect: true,
    });

    // 클래스룸 관리
    const classroom = useClassRoom({
        classId,
        isConnected,
        onClassEnd,
    });

    // 내 코드 전송
    const { sendCode } = useInstructorCodeSender({
        classId,
        isConnected,
        debounceDelay: 300,
    });

    // 학생 코드 보기
    const studentViewer = useStudentCodeViewer({
        classId,
        isConnected,
    });

    // 채팅
    const chat = useChat({
        classId,
        isConnected,
    });

    // 리액션
    const reaction = useChatReaction({
        classId,
        isConnected,
    });

    // 타이핑
    const typing = useTyping({
        classId,
        isConnected,
    });

    // 퇴장 처리
    const leave = useCallback(() => {
        studentViewer.clearSelection();
        classroom.leaveClass();
        disconnect();
    }, [studentViewer, classroom, disconnect]);

    return {
        // 연결 상태
        isConnected,
        isConnecting,
        isJoined: classroom.isJoined,

        // 클래스 정보
        participants: classroom.participants,
        students: classroom.students,
        studentCount: classroom.studentCount,
        totalCount: classroom.totalCount,
        classMode: classroom.classMode,

        // 내 코드 전송
        sendCode,

        // 학생 코드 보기
        selectedStudentId: studentViewer.selectedStudentId,
        studentCode: studentViewer.studentCode,
        studentLanguage: studentViewer.studentLanguage,
        selectStudent: studentViewer.selectStudent,
        clearStudentSelection: studentViewer.clearSelection,

        // 채팅
        messages: chat.messages,
        sendMessage: chat.sendMessage,
        deleteMessage: chat.deleteMessage,

        // 리액션
        toggleReaction: reaction.toggleReaction,
        myReactions: reaction.myReactions,

        // 타이핑
        typingUsers: typing.typingUsers,
        onTypingKeyDown: typing.onKeyDown,

        // 수업 관리
        changeMode: classroom.changeMode,
        endClass: classroom.endClass,
        kickUser: classroom.kickUser,

        // 액션
        leave,
    };
};

export default {
    useStudentClassRoom,
    useInstructorClassRoom,
};