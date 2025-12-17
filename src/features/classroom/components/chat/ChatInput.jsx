import React from "react";

export default function ChatInput({ inputValue, setInputValue, onSubmit, sendTyping, stopTyping, chatError }) {
    console.log("🟥 chatError:", chatError);
    const MAX = 500;
        return (
        <>
        <form className="chat-sidebar__input" onSubmit={onSubmit}>
            <input
                value={inputValue}
                onChange={(e) => {
                    const next = e.target.value;
                    setInputValue(e.target.value)
                    if (next.length > MAX) return;           //  500자 초과 입력 자체 차단
                    setInputValue(next)
                    if(e.target.value.trim()){sendTyping();
                    }else{
                        stopTyping();

                    }
                }}
                placeholder="메시지를 입력하세요"
            />
            <button type="submit">전송</button>
        </form>
            {chatError && <div className="chat-error">{chatError}</div>}
            </>
    );
}
