import React from "react";
import "./ChatPanel.css";

export default function ReplyPreview({ replyTarget, onCancelReply }) {
    if (!replyTarget) return null;

    return (
        <div className="reply-preview--above">
            <div className="reply-preview__bar" />
            <div className="reply-preview__body">
                <div className="reply-preview__name">{replyTarget.name}에게 답장</div>
                <div className="reply-preview__content">{replyTarget.content}</div>
            </div>
            <button
                type="button"
                className="reply-preview__close"
                onClick={onCancelReply}
            >
                ✕
            </button>
        </div>
    );
}
