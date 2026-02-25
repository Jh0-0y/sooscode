import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

/**
 * redirectIfAuth = true
 *  → 로그인 페이지처럼
 *    "이미 로그인한 사람은 못 들어오게"
 */
export default function PublicRoute({ redirectIfAuth = false }) {
    const { user } = useUser();

    if (user === undefined) return null;

    if (redirectIfAuth && user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}