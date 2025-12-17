import { useEffect, useRef, useState, useCallback } from "react";
import useSocket from "@/features/classroom/hooks/class/useSocket.js";
import { useUser } from "@/hooks/useUser.js";
import { useClassroom } from "@/features/classroom/contexts/ClassroomContext.jsx";

import { useChatScroll } from "./useChatScroll.js";
import { useChatTyping } from "./useChatTyping.js";
import { useChatApi } from "./useChatApi.js";

export const useChatPanel = () => {
    const { classId } = useClassroom();

    // ---------------- 상태 ----------------
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [replyTarget, setReplyTarget] = useState(null);

    const [activeMenuId, setActiveMenuId] = useState(null);
    const [highlightId, setHighlightId] = useState(null);

    // WebSocket
    const { connected, error, subscribe, publish } = useSocket(classId);

    // 로그인 유저
    const { user } = useUser();
    const myEmail = user?.email ?? null;
    const myName = user?.name ?? null;
    

    

    // 스크롤 훅
    const {
        bottomRef,
        messagesRef,
        handleScroll,
        isAtBottom,
        isAtBottomRef,
        messageRefs,
    } = useChatScroll({ messages, myEmail });

    // API 훅
    const { fetchHistory, sendReaction } = useChatApi({ classId, setMessages });

    // typing 훅
    const { typingUsers, setTypingUsers, sendTyping, stopTyping } = useChatTyping({
        connected,
        subscribe,
        publish,
        classId,
        myEmail,
        isAtBottomRef,
        bottomRef,
    });

    // ---------------- 입장 알림 (처음 연결시) ----------------
    useEffect(() => {
        if (!connected || !myName) return;
        if (document.visibilityState !== "visible") return;
        publish(`/app/chat/${classId}/enter`, {});
    }, [connected, classId, myName, publish]);

    // ---------------- 탭 visibility enter/exit ----------------
    useEffect(() => {
        const handleVisibility = () => {
            if (!connected || !myName) return;

            const isVisible = document.visibilityState === "visible";
            if (!isVisible) publish(`/app/chat/${classId}/exit`, {});
            else publish(`/app/chat/${classId}/enter`, {});
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [connected, myName, classId, publish]);

    // ---------------- 채팅 히스토리 ----------------
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // ---------------- WebSocket 수신 ----------------
    useEffect(() => {
        if (!connected) return;

        const subscription = subscribe(`/topic/class/${classId}/chat`, (body) => {
            const api = body.body ?? body;
            const msg = api.data ?? api;

            if (msg.type === "REACTION") {
                setMessages((prev) =>
                    prev.map((m) => (m.chatId === msg.chatId ? { ...m, reactionCount: msg.reactionCount } : m))
                );
                return;
            }

            if (msg.type === "DELETE") {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.chatId === msg.chatId
                            ? { ...m, deleted: true, content: "삭제된 메시지입니다." }
                            : m
                    )
                );
                return;
            }

            setMessages((prev) => [...prev, msg]);
        });

        return () => subscription?.unsubscribe?.();
    }, [connected, subscribe, classId]);

    // ---------------- 메시지 전송 ----------------
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!inputValue.trim()) return;

            if (!connected) {
                console.warn("웹소켓 연결 안 됨, 메시지 전송 불가");
                return;
            }

            const payload = {
                classId,
                content: inputValue,
                createdAt: new Date().toISOString(),
                replyToChatId: replyTarget?.chatId ?? null,
            };

            publish(`/app/class/${classId}/chat`, payload);

            stopTyping();
            setTypingUsers([]);
            setInputValue("");
            setReplyTarget(null);
        },
        [inputValue, connected, classId, publish, replyTarget, stopTyping, setTypingUsers]
    );

    // ---------------- 삭제 ----------------
    const handleDelete = useCallback(
        (chatId) => {
            if (!window.confirm("이 메시지를 삭제할까요?")) return;

            publish(`/app/chat/${classId}/delete`, { chatId });
            setActiveMenuId(null);
        },
        [publish, classId]
    );

    // ---------------- 답장 ----------------
    const handleReply = useCallback((msg) => {
        setReplyTarget({
            chatId: msg.chatId,
            name: msg.name,
            content: msg.content,
        });
    }, []);

    // ---------------- 특정 메시지로 스크롤 ----------------
    const scrollToMessage = useCallback((chatId) => {
        if (!chatId) return;

        const el = messageRefs.current[chatId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightId(chatId);
            setTimeout(() => setHighlightId(null), 1200);
        }
    }, [messageRefs]);

    // ---------------- 반환 ----------------
    return {
        messages,
        inputValue,
        replyTarget,
        activeMenuId,
        messageRefs,
        messagesRef,
        bottomRef,
        highlightId,
        connected,
        error,
        myEmail,

        typingUsers,
        sendTyping,
        stopTyping,

        setReplyTarget,
        setInputValue,
        setActiveMenuId,

        handleScroll,
        handleSubmit,
        handleDelete,
        handleReply,
        scrollToMessage,
        sendReaction,
    };
};
