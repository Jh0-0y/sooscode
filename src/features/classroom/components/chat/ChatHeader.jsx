import React from "react";

export default function ChatHeader({ classId, connected }) {
    return (
        <div className="chat-sidebar__header">
            <div className="chat-sidebar__title">
                채팅 (classId: {classId})
            </div>
            <div
                className={connected ? "chat-status online" : "chat-status offline"}
            />
        </div>
    );
}
