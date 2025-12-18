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

// userId 기준으로 변경 (email → userId)
const getSenderUserId = (m) => m?.userId ?? null;

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

    const curCreated = cur?.createdAt || "";
    const nextCreated = next?.createdAt || "";

    // 시스템 메시지는 항상 표시
    const isSystem = cur?.type === "SYSTEM";
    if (isSystem) return true;

    const sameUser = getSenderUserId(cur) === getSenderUserId(next);
    const sameMinute = isSameMinute(curCreated, nextCreated);
    const sameDate = getDateKey(curCreated) === getDateKey(nextCreated);

    return !(sameUser && sameMinute && sameDate);
}

export default function ChatMessageList({
                                            messages,
                                            myUserId,  // myEmail → myUserId
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
                                            fetchReactionUsers,
                                            typingUsers,
                                            checkMyReaction
                                        }) {
    return (
        <div
            className="chat-sidebar__messages"
            ref={messagesRef}
            onScroll={handleScroll}
        >
            {Array.isArray(messages) &&
                messages.map((msg, idx) => {
                    const isMine = msg.userId === myUserId;

                    // createdAt 사용 (백엔드 DTO 필드명)
                    const created = msg.createdAt || null;

                    // 시스템 메시지 판별 (SYSTEM 타입으로 수정)
                    const isSystem = msg.type === "SYSTEM";

                    // 이전 메시지와 날짜 비교 → 날짜 구분선 렌더링 여부
                    const prevMsg = messages[idx - 1];
                    const prevDateKey = prevMsg
                        ? getDateKey(prevMsg.createdAt)
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
                                myUserId={myUserId}  // myEmail → myUserId
                                isMine={isMine}
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
                                fetchReactionUsers={fetchReactionUsers}
                                showTime={showTime}
                                checkMyReaction={checkMyReaction}
                            />
                        </React.Fragment>
                    );
                })}
            {/* 타이핑 인디케이터 */}
            {typingUsers?.length > 0 && (
                <div className="chat-typing-indicator">
                    <span className="chat-typing-text">
                    {typingUsers.length === 1
                        ? `${typingUsers[0].username} 입력 중…`  // name → username
                        : `${typingUsers[0].username} 외 ${typingUsers.length - 1}명 입력 중…`}
                    </span>
                    <ChatTypingIndicator />
                </div>
            )}

            {/* 자동 스크롤용 anchor */}
            <div ref={bottomRef} />
        </div>
    );
}