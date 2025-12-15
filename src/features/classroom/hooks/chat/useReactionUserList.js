import { useState } from "react";

export default function useReactionUsers() {
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);

    const fetchUsers = async (chatId, reactionCount) => {
        if (!reactionCount || reactionCount <= 0) {
            setUsers([]);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/chat/${chatId}/reactionlist`, {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) return;

            const json = await res.json();
            setUsers(Array.isArray(json.data) ? json.data : []);
        } catch (e) {
            console.error(e);
        }
    };

    return {
        users,
        visible,
        onEnter: (chatId, reactionCount) => {
            setVisible(true);
            fetchUsers(chatId, reactionCount);
        },
        onLeave: () => setVisible(false),
    };
}
