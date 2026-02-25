// hooks/useUser.js
import { create } from "zustand";
import { api } from "@/services/api.js";

/**
 * 사용자 권한 ENUM
 */
export const USER_ROLES = {
    STUDENT: "STUDENT",
    INSTRUCTOR: "INSTRUCTOR",
    ADMIN: "ADMIN",
};

/**
 * 사용자 데이터 유효성 검증 및 정규화
 */
const validateUser = (data) => {
    if (!data) return null;
    const { email, name, role, profileImage } = data;

    if (!email || !name || !role) {
        console.error("이메일, 이름, 권한중 값이 하나라도 없음");
        return null;
    }

    if (!Object.values(USER_ROLES).includes(role)) {
        console.error("원하는 권한 값이 아님");
        return null;
    }

    return {
        email,
        name,
        role,
        profileImage: profileImage || null,
    };
};

/**
 * Zustand 내부 스토어
 */
const userStore = create((set) => ({
    user: null,
    authChecked: false,   // 🔥 추가

    setUser: (userData) => {
        const user = validateUser(userData);
        if (!user) return;
        set({ user });
    },

    clearUser: () => set({ user: null, authChecked: true }),

    initAuth: async () => {
        try {
            const result = await api.get("/api/me");
            const user = validateUser(result.data);
            set({ user, authChecked: true });
        } catch {
            try {
                await api.post("/api/auth/refresh");
                const result = await api.get("/api/me");
                const user = validateUser(result.data);
                set({ user, authChecked: true });
            } catch {
                set({ user: null, authChecked: true });
            }
        }
    },
}));

/**
 * 유저 훅
 */
export const useUser = () => ({
    user: userStore((state) => state.user),
    authChecked: userStore((state) => state.authChecked),
    setUser: userStore((state) => state.setUser),
    clearUser: userStore((state) => state.clearUser),
    initAuth: userStore((state) => state.initAuth),
});