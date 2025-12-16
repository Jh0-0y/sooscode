import React from "react";
import ChatMessageItem from "./ChatMessageItem.jsx";
import ChatTypingIndicator from "@/features/classroom/components/chat/button/ChatTypingIndicator.jsx";

// YYYY-MM-DD 키 뽑기 (날짜 변경 여부 비교용)
const getDateKey = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// 날짜만 포맷 (MM-DD)
const formatDateOnly = (iso) => {
    if (!iso) return "";

    const date = new Date(iso);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${month}-${day}`;
};

// 시간만 포맷 (AM 3:21)
const formatTimeOnly = (iso) => {
    if (!iso) return "";

    const date = new Date(iso);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${ampm} ${hours}:${minutes}`;
};
// email 기준 (확정)
const getSenderEmail = (m) => m?.email ?? "";

// 분 단위 비교
const isSameMinute = (a, b) => {
    const A = (a ?? "").slice(0, 16);
    const B = (b ?? "").slice(0, 16);
    return A && B && A === B;
};

// 시간 표시 여부 판단
const shouldShowTime = (messages, idx) => {
    const cur = messages[idx];
    const next = messages[idx + 1];
    if (!next) return true;

    const curCreated = cur?.created_at || cur?.createdAt || "";
    const nextCreated = next?.created_at || next?.createdAt || "";

    // 시스템 메시지는 항상 표시
    const isSystem = cur?.type === "ENTER" || cur?.type === "EXIT";
    if (isSystem) return true;

    const sameEmail = getSenderEmail(cur) === getSenderEmail(next);
    const sameMinute = isSameMinute(curCreated, nextCreated);
    const sameDate = getDateKey(curCreated) === getDateKey(nextCreated);

    return !(sameEmail && sameMinute && sameDate);
}

export default function ChatMessageList({
                                            messages,
                                            myEmail,
                                            messagesRef,
                                            bottomRef,
                                            handleScroll,
                                            activeMenuId,
                                            setActiveMenuId,
                                            messageRefs,
                                            highlightId,
                                            sendReaction,
                                            handleDelete,
                                            handleReply,
                                            scrollToMessage,
                                            typingUsers
                                        }) {
    return (
        <div
            className="chat-sidebar__messages"
            ref={messagesRef}
            onScroll={handleScroll}
        >
            {Array.isArray(messages) &&
                messages.map((msg, idx) => {
                    // createdAt / created_at 둘 다 대응
                    const created = msg.created_at || msg.createdAt || null;

                    // 시스템 메시지 판별
                    const isSystem =
                        msg.type === "ENTER" || msg.type === "EXIT";

                    // 이전 메시지와 날짜 비교 → 날짜 구분선 렌더링 여부
                    const prevMsg = messages[idx - 1];
                    const prevDateKey = prevMsg
                        ? getDateKey(prevMsg.created_at || prevMsg.createdAt)
                        : null;
                    const currentDateKey = getDateKey(created);
                    const isNewDate = idx === 0 || prevDateKey !== currentDateKey;
                    const dateDividerText =
                        isNewDate && created ? formatDateOnly(created) : null;
                    const showTime = shouldShowTime(messages, idx);

                    return (
                        <React.Fragment key={msg.chatId ?? idx}>
                            {/* 날짜 구분선 */}
                            {dateDividerText && (
                                <div className="chat-date-divider">
                                    {dateDividerText}
                                </div>
                            )}

                            {/* 실제 메시지(시스템/일반) */}
                            <ChatMessageItem
                                msg={msg}
                                myEmail={myEmail}
                                created={created}
                                isSystem={isSystem}
                                formatTimeOnly={formatTimeOnly}
                                activeMenuId={activeMenuId}
                                setActiveMenuId={setActiveMenuId}
                                messageRefs={messageRefs}
                                highlightId={highlightId}
                                sendReaction={sendReaction}
                                handleDelete={handleDelete}
                                handleReply={handleReply}
                                scrollToMessage={scrollToMessage}
                                showTime={showTime}
                            />
                        </React.Fragment>
                    );
                })}
            {/* 자동 스크롤용 anchor */}
            {typingUsers?.length > 0 && (
                <div className="chat-typing-indicator">
                    <span className="chat-typing-text">
                    {typingUsers.length === 1
                        ? `${typingUsers[0].name} 입력 중…`
                        : `${typingUsers[0].name} 외 ${typingUsers.length - 1}명 입력 중…`}
                    </span>
                    <ChatTypingIndicator />
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}
