import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function RoleRoute({ allow }) {
    const { user } = useUser();

    if (user === undefined) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allow.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}