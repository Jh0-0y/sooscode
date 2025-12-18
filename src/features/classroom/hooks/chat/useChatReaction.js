import {useCallback, useState} from "react";
import chatApi from "@/features/classroom/services/chatApi.js";

/**
 * 리액션 훅
 * - 리액션 토글
 * - 리액션 유저 목록 조회
 *
 * @param {Object} options
 * @param {number} options.classId - 클래스 ID
 * @param {boolean} options.isConnected - WebSocket 연결 상태
 */
export const useChatReaction = ({
                                classId,
                                isConnected = false,
                            } = {}) => {
    const [reactionUsers, setReactionUsers] = useState({});
    const [myReactions, setMyReactions] = useState({});

    // 리액션 토글
    const toggleReaction = useCallback((chatId) => {
        if (!classId || !isConnected) return;

        chatApi.toggleReaction(classId, chatId);

        // 낙관적 업데이트
        setMyReactions(prev => ({
            ...prev,
            [chatId]: !prev[chatId],
        }));
    }, [classId, isConnected]);

    // 리액션 유저 목록 조회
    const getReactionUsers = useCallback(async (chatId) => {
        try {
            const users = await chatApi.getReactionUsers(chatId);
            setReactionUsers(prev => ({
                ...prev,
                [chatId]: users,
            }));
            return users;
        } catch (error) {
            return [];
        }
    }, []);

    // 내가 리액션했는지 확인
    const checkMyReaction = useCallback(async (chatId) => {
        try {
            const reacted = await chatApi.hasReacted(chatId);
            setMyReactions(prev => ({
                ...prev,
                [chatId]: reacted,
            }));
            return reacted;
        } catch (error) {
            return false;
        }
    }, []);

    return {
        reactionUsers,
        myReactions,
        toggleReaction,
        getReactionUsers,
        checkMyReaction,
    };
};