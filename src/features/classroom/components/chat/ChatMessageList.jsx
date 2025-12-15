import React from "react";
import ChatMessageItem from "./ChatMessageItem.jsx";

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
                            />
                        </React.Fragment>
                    );
                })}
            {/* 자동 스크롤용 anchor */}
            <div ref={bottomRef} />
        </div>
    );
}
