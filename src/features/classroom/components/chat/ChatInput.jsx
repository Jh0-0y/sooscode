import React from "react";

export default function ChatInput({ inputValue, setInputValue, onSubmit }) {
    return (
        <form className="chat-sidebar__input" onSubmit={onSubmit}>
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="메시지를 입력하세요"
            />
            <button type="submit">전송</button>
        </form>
    );
}
