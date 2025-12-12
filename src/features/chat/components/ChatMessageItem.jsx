import React from "react";
import ReactionCheckbox from "@/features/chat/components/ui/ReactionCheckbox.jsx";
export default function ChatMessageItem({
                                            msg,
                                            myEmail,
                                            created,
                                            isSystem,
                                            formatTimeOnly,
                                            activeMenuId,
                                            setActiveMenuId,
                                            messageRefs,
                                            highlightId,
                                            sendReaction,
                                            handleDelete,
                                            handleReply,
                                            scrollToMessage,
                                        }) {
    const mine = msg.email === myEmail;          // 내 메시지인지
    const isDeleted = msg.deleted === true;      // 삭제 여부 (boolean)

    // 메세지 복사
    const handleCopy = () => {
        if(!msg.content) return;

        navigator.clipboard
            .writeText(msg.content)
            .then(() =>{
                
                console.log("복사완료");
            })
            .catch((err)=>{
                console.error("복사실패", err);
            })
            .finally(() => {
                setActiveMenuId(null)
            })
    }

    //  시스템 메시지 (입장 / 퇴장)
    if (isSystem) {
        const isEnter = msg.type === "ENTER";

        return (
            <div
                className={`chat-system-notice ${isEnter ? "enter" : "exit"}`}
            >
                <span className="system-text">{msg.content}</span>
                {created && (
                    <span className="chat-time">
                        {formatTimeOnly(created)}
                    </span>
                )}
            </div>
        );
    }

    //  일반 메시지 (채팅)
    return (
        <div
            ref={(el) => {
                if (el) {
                    // chatId → DOM element 저장 (스크롤 이동용)
                    messageRefs.current[msg.chatId] = el;
                }
            }}
            className={`chat-bubble ${mine ? "mine" : "other"} ${
                highlightId === msg.chatId ? "chat-bubble--highlight" : ""
            } ${isDeleted ? "chat-bubble--deleted" : ""}`}
        >
            {/* 답장 프리뷰 영역 (누르면 원본 메시지 위치로 스크롤) */}
            {msg.replyToChatId && (
                <div
                    className="chat-reply-preview"
                    onClick={() => scrollToMessage(msg.replyToChatId)}
                >
                    <div className="chat-reply-preview-header">
                        <span className="chat-reply-preview-name">
                            {msg.replyToName ?? "알 수 없음"}
                        </span>
                    </div>
                    <div className="chat-reply-preview-content">
                        {msg.replyToContent ??
                            (msg.replyToContent &&
                            msg.replyToContent.length > 40
                                ? msg.replyToContent.slice(0, 40) + "..."
                                : msg.replyToContent)}
                    </div>
                </div>
            )}

            {/* 내 메시지가 아니라면 유저 이름 표시 */}
            {!mine && (
                <div className="chat-username">
                    {msg.name}
                </div>
            )}

            {/* 본문 내용 */}
            <div className="chat-content">{msg.content}</div>
            {/* 시간 표시 */}
            <div className="chat-time">
                {formatTimeOnly(created)}
            </div>

            <div className="chat-actions">
                {/* 공감 버튼 / 카운트 */}
                <button
                    type="button"
                    className="chat-react-btn"
                    onClick={() => !isDeleted && sendReaction(msg.chatId)}
                    disabled={isDeleted} // 삭제된 메시지는 공감 불가
                >
                    ✅
                </button>
                <span className="chat-react-count">
                    {msg.reactionCount ?? 0}
                </span>

                {/* 삭제된 메시지는 ··· 메뉴 안 보이게 */}
                {!isDeleted && (
                    <div className="chat-actions-more">
                        {/* 세 점 버튼 */}
                        <button
                            type="button"
                            className="chat-more-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(
                                    activeMenuId === msg.chatId ? null : msg.chatId
                                );
                            }}
                        >
                            ···
                        </button>

                        {/* 세 점 메뉴 내용 */}
                        {activeMenuId === msg.chatId && (
                            <div className="chat-more-menu">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                >
                                    복사
                                </button>

                                {mine ? (
                                    // 내가 쓴 메시지 → 삭제만 가능
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(msg.chatId)}
                                    >
                                        삭제
                                    </button>
                                ) : (
                                    // 남의 메시지 → 답장하기만 가능
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleReply(msg);
                                            setActiveMenuId(null); // 메뉴 닫기
                                        }}
                                    >
                                        답장하기
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
