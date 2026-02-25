import React from "react";

export default function ChatHeader({  connected }) {
    return (
        <div className="chat-sidebar__header">
            <div className="chat-sidebar__title">
                채팅
            </div>
            <div
                className={connected ? "chat-status online" : "chat-status offline"}
            />
        </div>
    );
}
