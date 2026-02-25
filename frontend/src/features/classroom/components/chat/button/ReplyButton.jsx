import React from "react";
import "./ReplyButton.css";

const ReplyButton = ({ onClick }) => {
    return (
        <div className="reply-wrapper group">
            <button
                type="button"
                className="reply"
                onClick={onClick}
            >
                <svg
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    width={18}
                    height={18}
                    fill="none"
                    className="reply-icon"
                >
                    <path d="M8 9h8" />
                    <path d="M8 13h6" />
                    <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                </svg>
            </button>
        </div>
    );
};

export default ReplyButton;
