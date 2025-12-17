import { useCallback } from "react";
import {api} from "@/services/api.js";

/**
 * 히스토리 로드 + reactedByMe 채우기 + 공감 관련 API
 */
export const useChatApi = ({ classId, setMessages }) => {
    const fetchReactedByMe = useCallback(async (chatId) => {
        try {
            const res = api.get(`/api/chat/${chatId}/reacted`, {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) return false;

            const json = await res.json();
            return json.data === true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        try {
            const res =api.get(`/api/chat/history?classId=${classId}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                console.error("채팅 히스토리 요청 실패:", res.status);
                setMessages([]);
                return;
            }

            const result = await res.json();
            const list = Array.isArray(result.data) ? result.data : [];

            // 초기 seeded
            const seeded = list.map((m) => ({ ...m, reactedByMe: false }));
            setMessages(seeded);

            // 공감 있는 애들만 reactedByMe 채우기
            const targets = seeded.filter((m) => (m.reactionCount ?? 0) > 0);
            if (targets.length === 0) return;

            const pairs = await Promise.all(
                targets.map(async (m) => [m.chatId, await fetchReactedByMe(m.chatId)])
            );
            const map = new Map(pairs);

            setMessages((prev) =>
                prev.map((m) => (map.has(m.chatId) ? { ...m, reactedByMe: map.get(m.chatId) } : m))
            );
        } catch (e) {
            console.error("히스토리 요청 에러:", e);
            setMessages([]);
        }
    }, [classId, setMessages, fetchReactedByMe]);

    const sendReaction = useCallback(
        async (chatId) => {
            if (!chatId) {
                console.error("chatId 없음, 공감 전송 불가");
                return;
            }

            try {
                const res = api.post(`/api/chat/chat.react`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatId }),
                });

                if (!res.ok) {
                    console.error("공감 요청 실패:", res.status);
                    return;
                }

                // 내 reactedByMe만 업데이트
                const reacted = await fetchReactedByMe(chatId);
                setMessages((prev) =>
                    prev.map((m) => (m.chatId === chatId ? { ...m, reactedByMe: reacted } : m))
                );

                // reactionCount는 서버 WS 브로드캐스트가 갱신해줌 (원래대로)
            } catch (e) {
                console.error("공감 요청 에러:", e);
            }
        },
        [setMessages, fetchReactedByMe]
    );

    return {
        fetchHistory,
        sendReaction,
        fetchReactedByMe, // 혹시 외부에서 필요하면
    };
};
