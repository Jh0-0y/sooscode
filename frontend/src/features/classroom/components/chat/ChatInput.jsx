import React, { useEffect, useRef, useCallback } from "react";

export default function ChatInput({
                                      inputValue,
                                      setInputValue,
                                      onSubmit,
                                      sendTyping,
                                      stopTyping,
                                      chatError,
                                  }) {
    const textareaRef = useRef(null);
    const sendingRef = useRef(false); // 🔒 중복 전송 차단

    /* textarea 높이 자동 조절 */
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "40px";
        el.style.overflowY = "hidden";

        if (!inputValue?.trim()) return;

        const maxHeight = 120;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
        el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [inputValue]);

    /* 전송 (단일 진입점) */
    const submitMessage = useCallback(() => {
        if (!inputValue.trim()) return;
        if (sendingRef.current) return; // 🔥 핵심

        sendingRef.current = true;
        onSubmit();

        setInputValue("");
        stopTyping?.();

        // 다음 tick에서 해제
        requestAnimationFrame(() => {
            sendingRef.current = false;
        });
    }, [inputValue, onSubmit, setInputValue, stopTyping]);

    /* 키 입력 처리 */
    const handleKeyDown = useCallback(
        (e) => {
            // 🔥 IME 입력 중이면 무시 (한글 핵심)
            if (e.isComposing || e.keyCode === 229) return;

            // Shift + Enter → 줄바꿈
            if (e.key === "Enter" && e.shiftKey) return;

            // Enter → 전송
            if (e.key === "Enter") {
                e.preventDefault();
                submitMessage();
                return;
            }

            sendTyping?.();
        },
        [submitMessage, sendTyping]
    );

    return (
        <>
            <div className="chat-sidebar__input">
        <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            className="chat-input-textarea"
            rows={1}
        />

                <button
                    type="button"
                    onClick={submitMessage}
                    disabled={!inputValue.trim()}
                >
                    전송
                </button>
            </div>

            {chatError && <div className="chat-error">{chatError}</div>}
        </>
    );
}