import { useEffect, useRef, useState, useCallback } from "react";

/**
 * 채팅 스크롤 / 자동 스크롤 / messageRefs 관리
 */
export const useChatScroll = ({ messages, myUserId }) => {
    const bottomRef = useRef(null);
    const messagesRef = useRef(null);

    const prevLengthRef = useRef(0);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const isAtBottomRef = useRef(true);

    // chatId -> DOM element
    const messageRefs = useRef({});

    const handleScroll = useCallback(() => {
        const el = messagesRef.current;
        if (!el) return;

        const threshold = 20;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const atBottom = distanceFromBottom < threshold;

        setIsAtBottom(atBottom);
        isAtBottomRef.current = atBottom;
    }, []);

    // 메시지 추가될 때 자동 스크롤 (원래 로직 유지)
    useEffect(() => {
        if (!messages.length) {
            prevLengthRef.current = 0;
            return;
        }

        const lastMsg = messages[messages.length - 1];
        const isMine = myUserId && lastMsg.userId === myUserId;
        const increased = messages.length > prevLengthRef.current;

        if (increased && (isMine || isAtBottom)) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        prevLengthRef.current = messages.length;
    }, [messages, myUserId, isAtBottom]);

    return {
        bottomRef,
        messagesRef,
        handleScroll,
        isAtBottom,
        isAtBottomRef,
        messageRefs,
    };
};
