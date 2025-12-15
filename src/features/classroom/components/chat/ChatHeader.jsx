import React from "react";
import {useClassroom } from "@/features/classroom/contexts/ClassroomContext.jsx";

export default function ChatHeader({  connected }) {

    const { classId } = useClassroom()
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
