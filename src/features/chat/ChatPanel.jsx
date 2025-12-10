import React, { useEffect, useRef, useState } from "react";
import "./ChatPanel.css";
import useSocket from "@/features/classroom/hooks/useSocket.js";
import {useUser} from "@/hooks/useUser.js";

export default function ChatPanel({ classId = 1 }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const bottomRef = useRef(null);
    const prevLengthRef = useRef(0); //  새 메시지일 때만 스크롤용

    const messagesRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true)

    //  WebSocket / STOMP
    const { connected, error, subscribe, publish } = useSocket(classId);

    const { user, fetchUser } = useUser();


    //  스크롤 할 때마다 "지금 맨 아래인지" 계산
    const handleScroll = () => {
        const el = messagesRef.current;
        if (!el) return;

        const threshold = 20; // 얼마나 가까우면 "바닥"으로 볼지 (px)
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

        setIsAtBottom(distanceFromBottom < threshold);
    };

    //  내 정보 가져오기
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const myEmail = user?.email ?? null;
    const myName = user?.name ?? null;

    useEffect(() => {
        if (!connected || !myName) return

        //  입장 알림
        publish(`/app/chat/${classId}/enter`, {});

        //  언마운트 / 연결 끊길 때 퇴장 알림
        return () => {
            publish(`/app/chat/${classId}/exit`, {});
        };
    }, [connected, classId, myName, publish]);

    //  브라우저 종료 / 새로고침
    useEffect(() => {
        const handleUnload = () => {
            publish(`/app/chat/${classId}/exit`, {});
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [classId, publish]);

    //  히스토리 불러오기
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
                const list = Array.isArray(result.data) ? result.data : [];
                setMessages(list);
            } catch (e) {
                console.error("히스토리 요청 에러:", e);
                setMessages([]);
            }
        };

        fetchHistory();
    }, [classId]);

    //  WebSocket 수신 (공감 + 일반 메시지 분기 핵심)
    useEffect(() => {
        if (!connected) return;

        const subscription = subscribe(`/topic/chat/${classId}`, (body) => {
            console.log("📡 WebSocket 수신 raw:", body);

            const api = body.body ?? body;        // body 안쪽 ApiResponse 꺼냄
            const msg = api.data ?? api;

            // 1️⃣ 공감 브로드캐스트인 경우
            if (msg.chatId && typeof msg.reactionCount === "number") {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.chatId === msg.chatId
                            ? { ...m, reactionCount: msg.reactionCount }
                            : m
                    )
                );
                return;
            }

            // 2️⃣ 일반 채팅 / 시스템 메시지 추가
            setMessages((prev) => [...prev, msg]);
        });


        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [connected, subscribe, classId]);

    // 자동 스크롤 (새 메시지일 때만)
    useEffect(() => {
        if (!messages.length) {
            prevLengthRef.current = 0;
            return;
        }

        // 마지막 메시지
        const lastMsg = messages[messages.length - 1];

        // 이게 내가 보낸 메시지인지 체크
        const isMine = myEmail && lastMsg.email === myEmail;

        const increased = messages.length > prevLengthRef.current;

        //  규칙 정리:
        // 1) 내가 보낸 메시지면 무조건 내림
        // 2) 다른 사람이 보냈어도,
        //    내가 지금 "맨 아래 근처를 보고 있었으면" 내림
        if (increased && (isMine || isAtBottom)) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        prevLengthRef.current = messages.length;
    }, [messages, myEmail, isAtBottom])

    //  메시지 전송
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
        };

        publish(`/app/chat/${classId}`, payload);
        setInputValue("");
    };

    //  공감 전송 (이제 UI 직접 set 안 함 — WebSocket으로만 반영)
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
            }

            //  여기서 setMessages 하지 않음
            //  서버가 WebSocket으로 반영해줌
        } catch (e) {
            console.error("공감 요청 에러:", e);
        }
    };

    //  날짜 + AM/PM 시간 포맷 (MM-DD AM 3:21)
    const formatDateTime = (iso) => {
        if (!iso) return "";

        const date = new Date(iso);

        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12; // 0 → 12

        return `${month}-${day} ${ampm} ${hours}:${minutes}`;
    };
    // YYYY-MM-DD 형태로 날짜만 뽑기 (비교용)
    const getDateKey = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    //  시간만 포맷 (AM 3:21)
    const formatTimeOnly = (iso) => {
        if (!iso) return "";

        const date = new Date(iso);

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${ampm} ${hours}:${minutes}`;
    };




    return (
        <aside className="chat-sidebar">
            <div className="chat-sidebar__header">
                <div className="chat-sidebar__title">
                    채팅 (classId: {classId})
                </div>
                <div
                    className={connected ? "chat-status online" : "chat-status offline"}
                />
            </div>

            {error && <div className="chat-error">{error}</div>}

            <div
                className="chat-sidebar__messages"
                ref={messagesRef}
                onScroll={handleScroll}
            >
                {Array.isArray(messages) &&
                    messages.map((msg, idx) => {
                        //   [추가] 시스템 메시지(입장/퇴장)인지 판별
                        const isSystem =
                            msg.type === "ENTER" || msg.type === "EXIT";

                        const mine = msg.email === myEmail;

                        const created = msg.created_at || msg.createdAt || null;
                        //  이전 메시지 날짜 가져오기
                        const prevMsg = messages[idx - 1];
                        const prevDateKey = prevMsg
                            ? getDateKey(prevMsg.created_at || prevMsg.createdAt)
                            : null;

                        //  현재 메시지 날짜
                        const currentDateKey = getDateKey(created);

                        //  날짜가 바뀌었는지 여부 (또는 첫 메시지)
                        const isNewDate = idx === 0 || prevDateKey !== currentDateKey;

                        //  첫 메시지면 날짜+시간, 아니면 시간만
                        const formattedDateTime = isNewDate
                            ? formatDateTime(created)   //  MM-DD AM 3:21
                            : formatTimeOnly(created);  //  AM 3:21


                        //  ENTER / EXIT 같은 시스템 메세지 UI
                        if (isSystem) {
                            return (
                                <React.Fragment key={idx}>
                                    {formattedDateTime && (
                                        <div className="chat-date-divider">
                                            {formattedDateTime}
                                        </div>
                                    )}
                                    <div className="chat-system-message">
                                        {msg.content}
                                    </div>
                                </React.Fragment>
                            );
                        }

                        return (
                            <React.Fragment key={idx}>

                                    <div className="chat-date-divider">
                                        {formattedDateTime}
                                    </div>


                                <div
                                    className={`chat-bubble ${mine ? "mine" : "other"}`}
                                >
                                    {!mine && (
                                        <div className="chat-username">
                                            {msg.name}
                                        </div>
                                    )}

                                    <div className="chat-content">{msg.content}</div>

                                    <div className="chat-actions">
                                        <button
                                            type="button"
                                            className="chat-react-btn"
                                            onClick={() => sendReaction(msg.chatId)}
                                        >
                                            ✅
                                        </button>
                                        <span className="chat-react-count">
                                            {msg.reactionCount ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                <div ref={bottomRef} />
            </div>

            <form className="chat-sidebar__input" onSubmit={handleSubmit}>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="메시지 입력..."
                />
                <button type="submit">전송</button>
            </form>
        </aside>
    );
}
