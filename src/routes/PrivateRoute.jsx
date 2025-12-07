// routes/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const PrivateRoute = ({ allowedRoles }) => {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/error/403" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;