import { useEffect, useRef, useState, useCallback } from "react";

/**
 * typing 구독 + sendTyping/stopTyping
 * - 다른 사람 typing만 보여줌
 * - typingUsers 증가했고 내가 바닥 보고 있으면 자동 스크롤
 */
export const useChatTyping = ({
                                  connected,
                                  subscribe,
                                  publish,
                                  classId,
                                  myEmail,
                                  isAtBottomRef,
                                  bottomRef,
                              }) => {
    const [typingUsers, setTypingUsers] = useState([]); // [{userId, name}]
    const typingTimerRef = useRef(null);
    const lastSentRef = useRef(0);

    // typing 수신 구독
    useEffect(() => {
        if (!connected) return;

        const sub = subscribe(`/topic/chat/${classId}/typing`, (body) => {
            // body 형태 통일
            const data = JSON.parse(body.body ?? body);
            console.log(myEmail,"내이메일ㅇ", data.email, "데이타이메일")
            // 내 typing은 표시 안 함
            if (myEmail && data.email === myEmail) return;
            

            

            setTypingUsers((prev) => {
                const exists = prev.some((u) => u.userId === data.userId);

                let next = prev;
                if (data.typing) {
                    next = exists ? prev : [...prev, { userId: data.userId, name: data.name }];
                } else {
                    next = prev.filter((u) => u.userId !== data.userId);
                }

                // 늘어났고 내가 바닥이면 자동 스크롤
                const increased = next.length > prev.length;
                if (increased && isAtBottomRef?.current) {
                    requestAnimationFrame(() => {
                        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
                    });
                }

                return next;
            });
        });

        return () => sub?.unsubscribe?.();
    }, [connected, subscribe, classId, myEmail, isAtBottomRef, bottomRef]);

    const sendTyping = useCallback(() => {
        if (!connected) return;

        const now = Date.now();
        if (now - lastSentRef.current < 300) return; // 레이트 제한
        lastSentRef.current = now;

        publish("/app/chat.typing", { classId });

        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            publish("/app/chat.stopTyping", { classId });
        }, 1500);
    }, [connected, publish, classId]);

    const stopTyping = useCallback(() => {
        if (!connected) return;
        clearTimeout(typingTimerRef.current);
        publish("/app/chat.stopTyping", { classId });
    }, [connected, publish, classId]);

    return {
        typingUsers,
        setTypingUsers,
        sendTyping,
        stopTyping,
    };
};
