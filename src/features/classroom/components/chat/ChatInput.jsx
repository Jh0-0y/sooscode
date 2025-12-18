import React, {useEffect, useRef} from "react";

export default function ChatInput({ inputValue, setInputValue, onSubmit, sendTyping, stopTyping, chatError }) {

    const MAX = 500;

    const textareaRef = useRef(null);

    // 텍스트 영역 높이 자동 조절
    useEffect(() => {
        if (textareaRef.current) {

            // 값이 없으면 높이 초기화
            if (!inputValue || inputValue.trim() === "") {
                textareaRef.current.style.height = "40px";
                textareaRef.current.style.overflowY = "hidden";
                return;
            }

            // 높이를 초기화하여 scrollHeight를 정확하게 측정
            textareaRef.current.style.height = "40px";

            const scrollHeight = textareaRef.current.scrollHeight;

            // scrollHeight가 40px(1줄)보다 크면 높이 증가
            if (scrollHeight > 40) {
                textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
                textareaRef.current.style.overflowY = scrollHeight > 120 ? "auto" : "hidden";
            } else {
                textareaRef.current.style.overflowY = "hidden";
            }
        }
    }, [inputValue]);
    // 키 입력 핸들러
    const handleKeyDown = (e) => {
        // Enter 키 처리
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
            return;
        }

        // Shift + Enter는 줄바꿈 (기본 동작)

        // 타이핑 표시
        sendTyping?.(e);
    };

    // 입력 변경 핸들러
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    // 전송 버튼 클릭
    const handleSubmitClick = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <>
        <form  onSubmit={handleSubmitClick} className="chat-sidebar__input">
            <textarea
                onInput={(e) => {
                    const el = e.target;
                    el.style.height = "36px";
                    el.style.height = Math.min(el.scrollHeight, 120) + "px";
                    el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
                }}
                ref={textareaRef}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요"
                className="chat-input-textarea"
            />
            <button type="submit">전송</button>
        </form>
            {chatError && <div className="chat-error">{chatError}</div>}
            </>
    );
}
