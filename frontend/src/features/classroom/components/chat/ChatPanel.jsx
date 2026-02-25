import React, {useState, useCallback, useEffect} from "react";
import "./ChatPanel.css";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessageList from "./ChatMessageList.jsx";
import ChatInput from "./ChatInput.jsx";
import ReplyPreview from "./ReplyPreview.jsx";
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { useSocketContext } from "@/features/classroom/contexts/SocketContext.jsx";
import { useUser } from "@/hooks/useUser.js";
import { useChat } from "@/features/classroom/hooks/chat/useChat.js";
import { useChatReaction } from "@/features/classroom/hooks/chat/useChatReaction.js";
import { useTyping } from "@/features/classroom/hooks/chat/useChatTyping.js";
import { useChatScroll } from "@/features/classroom/hooks/chat/useChatScroll.js";

/**
 * 채팅 패널
 * - 개별 훅들을 조합하여 사용
 */
export default function ChatPanel() {
    const { classId } = useClassroomContext();
    const { isConnected } = useSocketContext();
    const { user } = useUser();

    // 로컬 상태
    const [inputValue, setInputValue] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [replyTarget, setReplyTarget] = useState(null);
    const [highlightId, setHighlightId] = useState(null);
    const [error, setError] = useState(null);
    const [chatError, setChatError] = useState(null);
    const [myUserId, setMyUserId] = useState(null);

    // 채팅 훅 (메시지 전송/수신/삭제)
    const {
        messages,
        isLoading,
        sendMessage,
        deleteMessage,
        checkMyReaction,
    } = useChat({
        classId,
        isConnected,
    });

    // 메시지에서 내 userId 자동 감지
    useEffect(() => {
        if (myUserId || !user?.email || messages.length === 0) return;

        // 내가 보낸 메시지 찾기 (email로 비교)
        // 백엔드에서 email도 함께 보내준다고 가정
        // 만약 email이 없다면, 가장 최근에 내가 보낸 메시지를 찾아야 함

        // 방법 1: 히스토리에서 찾기 (username으로 비교 - 임시)
        const myMessage = messages.find(msg =>
            msg.username === user.name || // name으로 비교
            msg.email === user.email      // email이 있다면
        );

        if (myMessage?.userId) {
            setMyUserId(myMessage.userId);
        } else {
        }
    }, [messages, user, myUserId]);

    // 새 메시지 전송 시 userId 감지
    useEffect(() => {
        if (myUserId || messages.length === 0) return;

        // 가장 최근 메시지가 내가 보낸 것이라고 가정 (방금 전송한 경우)
        const lastMessage = messages[messages.length - 1];

        if (lastMessage?.userId && lastMessage.username === user?.name) {
            setMyUserId(lastMessage.userId);
        }
    }, [messages, myUserId, user]);

    // 리액션 훅
    const {
        reactionUsers,
        myReactions,
        toggleReaction,
        getReactionUsers,
    } = useChatReaction({
        classId,
        isConnected,
    });

    // 타이핑 훅
    const {
        typingUsers,
        onKeyDown: sendTyping,
        stopTyping,
    } = useTyping({
        classId,
        isConnected,
        timeout: 1000,
    });

    // 스크롤 훅
    const {
        messagesRef,
        bottomRef,
        handleScroll,
        messageRefs,
    } = useChatScroll({
        messages,
        myUserId,  // myEmail → myUserId로 변경
    });

    // 메시지 제출
    const handleSubmit = useCallback((e) => {
        e?.preventDefault();

        if (!inputValue.trim()) {
            setChatError('메시지를 입력하세요.');
            return;
        }

        try {
            sendMessage(inputValue, replyTarget?.chatId || null);
            setInputValue('');
            setReplyTarget(null);
            setChatError(null);
            stopTyping();
        } catch (err) {
            setChatError('메시지 전송 실패');
        }
    }, [inputValue, replyTarget, sendMessage, stopTyping]);

    // 메시지 삭제
    const handleDelete = useCallback((chatId) => {
        try {
            deleteMessage(chatId);
        } catch (err) {
            setError('메시지 삭제 실패');
        }
    }, [deleteMessage]);

    // 답장
    const handleReply = useCallback((message) => {
        setReplyTarget({
            chatId: message.chatId,
            username: message.username,
            content: message.content,
        });
    }, []);

    // 특정 메시지로 스크롤
    const scrollToMessage = useCallback((chatId) => {
        const messageElement = messageRefs.current[chatId];
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 하이라이트 효과
            setHighlightId(chatId);
            setTimeout(() => setHighlightId(null), 2000);
        }
    }, [messageRefs]);

    // 리액션 전송
    const sendReaction = useCallback((chatId) => {
        try {
            toggleReaction(chatId);
        } catch (err) {
        }
    }, [toggleReaction]);

    // 리액션 유저 목록 조회
    const fetchReactionUsers = useCallback(async (chatId) => {
        try {
            return await getReactionUsers(chatId);
        } catch (err) {
            return [];
        }
    }, [getReactionUsers]);

    return (
        <aside className="chat-sidebar">
            {/* 상단 헤더 */}
            {/*<ChatHeader classId={classId} connected={isConnected} />*/}

            {/* 에러 메시지 */}
            {error && <div className="chat-error">{error}</div>}

            {/* 메시지 리스트 */}
            <ChatMessageList
                messages={messages}
                myUserId={myUserId}
                messagesRef={messagesRef}
                bottomRef={bottomRef}
                handleScroll={handleScroll}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                messageRefs={messageRefs}
                highlightId={highlightId}
                sendReaction={sendReaction}
                handleDelete={handleDelete}
                handleReply={handleReply}
                scrollToMessage={scrollToMessage}
                fetchReactionUsers={fetchReactionUsers}
                typingUsers={typingUsers}
                checkMyReaction={checkMyReaction}
            />

            {/* 답장 프리뷰 */}
            <ReplyPreview
                replyTarget={replyTarget}
                onCancelReply={() => setReplyTarget(null)}
            />

            {/* 입력창 */}
            <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSubmit={handleSubmit}
                sendTyping={sendTyping}
                stopTyping={stopTyping}
                chatError={chatError}
            />
        </aside>
    );
}