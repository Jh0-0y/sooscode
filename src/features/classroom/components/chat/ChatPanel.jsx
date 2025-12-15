import React from "react";
import "./ChatPanel.css";
import { useChatPanel } from "@/features/classroom/hooks/chat/useChatPanel.js"; // 경로 맞게 수정
import ChatHeader from "./ChatHeader.jsx";
import ChatMessageList from "./ChatMessageList.jsx";
import ChatInput from "./ChatInput.jsx";
import { useClassroom } from "@/features/classroom/contexts/ClassroomContext.jsx";
import ReplyPreview from "@/features/classroom/components/chat/ReplyPreview.jsx";

export default function ChatPanel() {

    const { classId } = useClassroom()
    // 커스텀 훅에서 상태와 핸들러 전부 가져오기
    const {
        messages,
        inputValue,
        activeMenuId,
        messageRefs,
        messagesRef,
        bottomRef,
        highlightId,
        connected,
        error,
        myEmail,
        setInputValue,
        setActiveMenuId,
        handleScroll,
        handleSubmit,
        handleDelete,
        handleReply,
        scrollToMessage,
        sendReaction,
        replyTarget,
        setReplyTarget,
        fetchReactionUsers
    } = useChatPanel(classId);

    return (
        <aside className="chat-sidebar">
            {/* 상단 헤더 */}
            <ChatHeader classId={classId} connected={connected} />

            {/* 에러 메시지 */}
            {error && <div className="chat-error">{error}</div>}

            {/* 메시지 리스트 */}
            <ChatMessageList
                messages={messages}
                myEmail={myEmail}
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
            />

            {/* 입력창 */}
            <ReplyPreview
                replyTarget={replyTarget}
                onCancelReply={() => setReplyTarget(null)}
            />

            <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSubmit={handleSubmit}
            />
        </aside>
    );
}
