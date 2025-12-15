// src/features/chat/hooks/useChatPanel.js (경로는 원하는 대로)
// 채팅 패널에서 사용하는 모든 상태 / 효과 / 소켓 / API 로직을 모아둔 커스텀 훅

import { useEffect, useRef, useState } from "react";
import useSocket from "@/features/classroom/hooks/class/useSocket.js";
import { useUser } from "@/hooks/useUser.js";

export const useChatPanel = (classId = 1) => {
    // ---------------- 상태 ----------------
    // 채팅 메시지 리스트
    const [messages, setMessages] = useState([]);
    // 입력창 텍스트
    const [inputValue, setInputValue] = useState("");
    // 현재 답장 대상 (null 이면 답장모드 아님)
    const [replyTarget, setReplyTarget] = useState(null);

    // 맨 아래로 스크롤용 ref
    const bottomRef = useRef(null);
    // 이전 메시지 길이 기억 → 새 메시지인지 판단
    const prevLengthRef = useRef(0);
    // 스크롤 컨테이너 ref
    const messagesRef = useRef(null);
    // 내가 지금 "바닥 근처를 보고 있는지" 여부
    const [isAtBottom, setIsAtBottom] = useState(true);

    // 어떤 메시지의 ··· 메뉴가 열려있는지
    const [activeMenuId, setActiveMenuId] = useState(null);
    // chatId → DOM element 매핑
    const messageRefs = useRef({});
    // 하이라이트(스크롤로 점프했을 때 깜빡이도록) 대상 chatId
    const [highlightId, setHighlightId] = useState(null);

    // WebSocket (STOMP) 훅
    const { connected, error, subscribe, publish } = useSocket(classId);

    // 로그인 유저 정보
    const { user } = useUser();
    const myEmail = user?.email ?? null;
    const myName = user?.name ?? null;



    // ---------------- 스크롤 핸들러 ----------------
    const handleScroll = () => {
        const el = messagesRef.current;
        if (!el) return;

        const threshold = 20; // 바닥 기준 (px)
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

        setIsAtBottom(distanceFromBottom < threshold);
    };

    // ---------------- 입장 알림 (처음 연결시) ----------------
    useEffect(() => {
        // 소켓 연결이 안됐거나, 내 이름을 아직 모르면 무시
        if (!connected || !myName) return;

        // 탭이 보이지 않는 상태면 굳이 enter 안보냄
        if (document.visibilityState !== "visible") return;

        // STOMP로 입장 이벤트 전송
        publish(`/app/chat/${classId}/enter`, {});
    }, [connected, classId, myName, publish]);

    // ---------------- 탭 visibility 에 따른 enter/exit ----------------
    useEffect(() => {
        const handleVisibility = () => {
            if (!connected || !myName) return;

            const isVisible = document.visibilityState === "visible";

            if (!isVisible) {
                // 다른 탭, 다른 사이트, 창 닫기 등으로 떠났을 때
                publish(`/app/chat/${classId}/exit`, {});
            } else {
                // 다시 이 탭으로 돌아왔을 때
                publish(`/app/chat/${classId}/enter`, {});
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [connected, myName, classId, publish]);

    // ---------------- 채팅 히스토리 최초 로드 ----------------
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/chat/history?classId=${classId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!res.ok) {
                    console.error("채팅 히스토리 요청 실패:", res.status);
                    setMessages([]);
                    return;
                }

                const result = await res.json();
                console.log(result, "📜 채팅 히스토리 응답");
                const list = Array.isArray(result.data) ? result.data : [];
                const seeded = list.map((m) => ({ ...m, reactedByMe: false }));
                setMessages(seeded);

                // 공감 있는 애들만 내가 눌렀는지 조회해서 채우기
                const targets = seeded.filter((m) => (m.reactionCount ?? 0) > 0);

                if (targets.length > 0) {
                    const pairs = await Promise.all(
                        targets.map(async (m) => [m.chatId, await fetchReactedByMe(m.chatId)])
                    );
                    const map = new Map(pairs);

                    setMessages((prev) =>
                        prev.map((m) =>
                            map.has(m.chatId) ? { ...m, reactedByMe: map.get(m.chatId) } : m
                        )
                    );
                }
            } catch (e) {
                console.error("히스토리 요청 에러:", e);
                setMessages([]);
            }
        };

        fetchHistory();
    }, [classId]);

    // ---------------- WebSocket 수신 처리 ----------------
    useEffect(() => {
        if (!connected) return;

        // /topic/class/{classId}/chat 구독
        const subscription = subscribe(`/topic/class/${classId}/chat`, (body) => {
            console.log("📡 WebSocket 수신 raw:", body);

            const api = body.body ?? body; // ApiResponse 껍데기 벗기기
            const msg = api.data ?? api;   // data 안에 진짜 메시지 있음



            if (msg.type === "REACTION") {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.chatId === msg.chatId
                            ? { ...m, reactionCount: msg.reactionCount }
                            : m
                    )
                );
                return;
            }

            // 2) 삭제 브로드캐스트 (type === "DELETE")
            if (msg.type === "DELETE") {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.chatId === msg.chatId
                            ? {
                                ...m,
                                deleted: true, // 프론트에서도 플래그 세팅
                                content: "삭제된 메시지입니다.",
                            }
                            : m
                    )
                );
                return;
            }

            // 3) 일반 채팅 / 시스템 메시지 추가
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [connected, subscribe, classId]);

    // ---------------- 자동 스크롤 ----------------
    useEffect(() => {
        if (!messages.length) {
            prevLengthRef.current = 0;
            return;
        }

        const lastMsg = messages[messages.length - 1];

        // 마지막 메시지가 내가 보낸 것인지
        const isMine = myEmail && lastMsg.email === myEmail;

        // 메시지 배열 길이가 늘어났는지 (= 새로운 메시지 도착했는지)
        const increased = messages.length > prevLengthRef.current;

        /*
         * 자동 스크롤 규칙:
         * 1) 내가 보낸 메시지면 무조건 스크롤 내려감
         * 2) 다른 사람이 보냈더라도, 내가 원래 바닥 근처를 보고 있었다면 내려감
         */
        if (increased && (isMine || isAtBottom)) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        prevLengthRef.current = messages.length;
    }, [messages, myEmail, isAtBottom]);

    // ---------------- 메시지 전송 ----------------
    const handleSubmit = (e) => {
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
            replyToChatId: replyTarget?.chatId ?? null, // 답장이면 대상 chatId
        };

        publish(`/app/class/${classId}/chat`, payload);
        setInputValue("");
        setReplyTarget(null); // 전송 후 답장 상태 초기화
    };

    // ---------------- 메시지 삭제 요청 ----------------
    const handleDelete = (chatId) => {
        if (!window.confirm("이 메시지를 삭제할까요?")) return;

        publish(`/app/chat/${classId}/delete`, {
            chatId, // ChatDeleteRequest.chatId 로 매핑
        });

        setActiveMenuId(null);
    };

    // ---------------- 답장 시작 ----------------
    const handleReply = (msg) => {
        setReplyTarget({
            chatId: msg.chatId,
            name: msg.name,
            content: msg.content,
        });

        // 필요하면 여기서 입력창에 @이름 선입력도 가능
        // setInputValue((prev) => (prev ? prev : `@${msg.name} `));
    };

    // ---------------- 특정 메시지 위치로 스크롤 & 하이라이트 ----------------
    const scrollToMessage = (chatId) => {
        if (!chatId) return;

        const el = messageRefs.current[chatId];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            setHighlightId(chatId);
            // 1.2초 뒤에 하이라이트 해제
            setTimeout(() => setHighlightId(null), 1200);
        }
    };

    // ---------------- 공감 요청 (HTTP) ----------------
    const sendReaction = async (chatId) => {
        if (!chatId) {
            console.error("chatId 없음, 공감 전송 불가");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/chat/chat.react", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId }),
            });

            if (!res.ok) {
                console.error("공감 요청 실패:", res.status);
                return;
            }

            //  내 reactedByMe만 따로 조회해서 업데이트
            const reacted = await fetchReactedByMe(chatId);
            setMessages((prev) =>
                prev.map((m) => (m.chatId === chatId ? { ...m, reactedByMe: reacted } : m))
            );

            // 서버에서 WebSocket 브로드캐스트 해주므로 여기서는 setMessages 안 함
        } catch (e) {
            console.error("공감 요청 에러:", e);
        }
    };
    // 내가 공감했는지 안했는지 여부확인
    const fetchReactedByMe = async (chatId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/chat/${chatId}/reacted`, {
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
    };




    // ---------------- 훅 반환값 ----------------
    return {
        // 상태 / 값
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

        // setter / 핸들러
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
