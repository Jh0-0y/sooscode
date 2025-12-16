// ClassModeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";

export const CLASS_MODES = {
    VIEW_ONLY: "VIEW_ONLY",
    FREE_PRACTICE: "FREE_PRACTICE",
};

const ClassModeContext = createContext(null);

export const ClassModeProvider = ({ children, classId }) => {
    const socket = useSocketContext();
    const [mode, setMode] = useState(CLASS_MODES.FREE_PRACTICE);

    // 학생/강사 공통 구독
    useEffect(() => {
        if (!socket || !socket.connected || !classId) return;

        const sub = socket.subscribe(
            `/topic/class/${classId}/mode`,
            (msg) => {
                setMode(msg.mode);
            }
        );

        return () => sub.unsubscribe();
    }, [socket, classId]);

    // 강사 모드 변경
    const changeMode = (newMode) => {
        socket.publish(`/app/class/${classId}/mode`, {
            mode: newMode,
        });
    };

    return (
        <ClassModeContext.Provider value={{ mode, changeMode }}>
            {children}
        </ClassModeContext.Provider>
    );
};

export const useClassMode = () => useContext(ClassModeContext);
