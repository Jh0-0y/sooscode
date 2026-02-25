import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function PrivateRoute() {
    const { user } = useUser();

    // 아직 me 요청 중
    if (user === undefined) return null;

    // 로그인 안 됨
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}