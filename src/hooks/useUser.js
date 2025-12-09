// hooks/useUser.js (또는 stores/useUser.js)
import { create } from "zustand";
import {api} from "@/services/api.js";

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

    setUser: (userData) => {
        const user = validateUser(userData);
        if (!user) {
            return;
        }
        set({ user });
    },

    clearUser: () => set({ user: null }),

    fetchUser: async () => {
        try {
            const { data } = await api.get('/api/auth/me');
            console.log(data);
            const user = validateUser(data.user);
            set({ user, loading: false });
        } catch (err) {
            set({ user: null, loading: false });
        }
    },
}));

/**
 *  유저 훅
 */
export const useUser = () => ({
    user: userStore((state) => state.user),
    setUser: userStore((state) => state.setUser),
    clearUser: userStore((state) => state.clearUser),
    fetchUser: userStore((state) => state.fetchUser),
});

/**
 * 유저 정보 관리 커스텀 훅
 *
 * // 훅 import
 * import { useUser } from "@/hooks/useUser";
 * // 구조 분해 할당 (필요한 것만 가져오면 됨)
 * const { user, setUser, clearUser } = useUser();
 * // 로그인 성공 시 유저 저장
 * setUser({
 *     email: "test@test.com",
 *     name: "홍길동",
 *     role: "INSTRUCTOR",              // "STUDENT" | "INSTRUCTOR" | "ADMIN"
 *     profileImage: "/img/profile.png" // 프로필 이미지 URL(optional)
 * });
 * // 로그아웃
 * clearUser();
 *
 * // 유저 정보 접근(?는 옵셔널 체이닝 연산자 null일 경우 에러X undefined로 변환)
 * console.log(user.email); //null일 경우 에러 발생
 * console.log(user?.name);
 * console.log(user?.role);
 * console.log(user?.profileImage);
 *
 */
