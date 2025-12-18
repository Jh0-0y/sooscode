import React, {useState, useCallback, useEffect} from "react";
import CheckIcon from "./button/ReactionButton.jsx";
import DeleteButton from "@/features/classroom/components/chat/button/DeleteButton.jsx";
import CopyButton from "@/features/classroom/components/chat/button/CopyButton.jsx";
import ReplyButton from "@/features/classroom/components/chat/button/ReplyButton.jsx";

export default function ChatMessageItem({
                                            msg,
                                            myUserId,  // myEmail → myUserId
                                            created,
                                            isSystem,
                                            isMine,
                                            formatTimeOnly,
                                            activeMenuId,
                                            setActiveMenuId,
                                            messageRefs,
                                            highlightId,
                                            sendReaction,
                                            handleDelete,
                                            handleReply,
                                            scrollToMessage,
                                            showTime,
                                            fetchReactionUsers,
                                            checkMyReaction
                                        }) {
    // userId로 내 메시지 판별 (email → userId)
    const mine = isMine;
    const isDeleted = msg.deleted === true;

    // 리액션 유저 툴팁 상태
    const [reactionUsers, setReactionUsers] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);

    // 내가 리액션했는지 여부
    const [hasReacted, setHasReacted] = useState(false);
    const [isCheckingReaction, setIsCheckingReaction] = useState(false);

    // 컴포넌트 마운트 시 내가 리액션했는지 확인
    useEffect(() => {
        const checkReaction = async () => {
            if (!checkMyReaction || !msg.chatId || isCheckingReaction) return;

            setIsCheckingReaction(true);

            try {
                const reacted = await checkMyReaction(msg.chatId);
                setHasReacted(reacted);
                console.log(`[ChatMessageItem] chatId ${msg.chatId} 리액션 상태:`, reacted);
            } catch (error) {
                console.error('[ChatMessageItem] 리액션 확인 실패:', error);
            } finally {
                setIsCheckingReaction(false);
            }
        };

        checkReaction();
    }, [msg.chatId, msg.reactionCount, checkMyReaction]);

    // 마우스 엔터 시 리액션 유저 조회
    const handleMouseEnter = useCallback(async () => {
        if (msg.reactionCount > 0) {
            const users = await fetchReactionUsers(msg.chatId);
            setReactionUsers(users || []);
            setShowTooltip(true);
        }
    }, [msg.chatId, msg.reactionCount, fetchReactionUsers]);

    // 마우스 리브 시 툴팁 숨기기
    const handleMouseLeave = useCallback(() => {
        setShowTooltip(false);
    }, []);

    // 리액션 클릭 핸들러
    const handleReactionClick = () => {
        if (isDeleted) return;

        // 낙관적 업데이트 (토글)
        setHasReacted(prev => !prev);

        // 백엔드에 전송
        sendReaction(msg.chatId);
    };

    // 메시지 복사
    const handleCopy = () => {
        if(!msg.content) return;

        navigator.clipboard
            .writeText(msg.content)
            .then(() => {
                console.log("복사완료");
            })
            .catch((err) => {
                console.error("복사실패", err);
            })
            .finally(() => {
                setActiveMenuId(null)
            })
    }

    // 시스템 메시지 (입장 / 퇴장)
    if (isSystem) {
        return (
            <div className="chat-system-notice">
                <span className="system-text">{msg.content}</span>
                {created && showTime && (
                    <span className="chat-time">
                        {formatTimeOnly(created)}
                    </span>
                )}
            </div>
        );
    }

    // 일반 메시지 (채팅)
    return (
        <div
            ref={(el) => {
                if (el) {
                    messageRefs.current[msg.chatId] = el;
                }
            }}
            className={`chat-bubble ${mine ? "mine" : "other"} ${
                highlightId === msg.chatId ? "chat-bubble--highlight" : ""
            } ${isDeleted ? "chat-bubble--deleted" : ""}`}
        >
            {/* 답장 프리뷰 영역 */}
            {msg.replyToChatId && (
                <div
                    className="chat-reply-preview"
                    onClick={() => scrollToMessage(msg.replyToChatId)}
                >
                    <div className="chat-reply-preview-header">
                        <span className="chat-reply-preview-name">
                            {msg.replyToUsername ?? "알 수 없음"}
                        </span>
                    </div>
                    <div className="chat-reply-preview-content">
                        {msg.replyToContent
                            ? (msg.replyToContent.length > 40
                                ? msg.replyToContent.slice(0, 40) + "..."
                                : msg.replyToContent)
                            : ""}
                    </div>
                </div>
            )}

            {/* 내 메시지가 아니라면 유저 이름 표시 */}
            {!mine && (
                <div className="chat-username">
                    {msg.username}
                </div>
            )}

            {/* 본문 내용 */}
            <div className="chat-content">{msg.content}</div>

            {/* 시간 표시 */}
            {showTime && (
                <div className="chat-time">
                    {formatTimeOnly(created)}
                </div>
            )}

            <div className="chat-actions">
                {/* 공감 버튼 / 카운트 */}
                <div
                    className="chat-react-wrap"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button
                        type="button"
                        className={`chat-react-btn ${hasReacted ? 'is-active' : ''}`}
                        onClick={() => !isDeleted && handleReactionClick(msg.chatId)}
                        disabled={isDeleted}
                    >
                        <CheckIcon className="chat-react-icon" />
                    </button>
                    <span className="chat-react-count">
                        {msg.reactionCount ?? 0}
                    </span>

                    {/* 리액션 유저 툴팁 */}
                    {showTooltip && reactionUsers.length > 0 && (
                        <div className="chat-react-tooltip">
                            {reactionUsers.map((u) => (
                                <div key={u.userId} className="chat-react-user">
                                    {u.username}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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
                            <div
                                className="chat-more-menu"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <CopyButton onClick={handleCopy} />

                                {mine ? (
                                    <DeleteButton
                                        onClick={() => handleDelete(msg.chatId)}
                                    />
                                ) : (
                                    <ReplyButton
                                        onClick={() => {
                                            handleReply(msg);
                                            setActiveMenuId(null);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}