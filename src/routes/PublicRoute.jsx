// routes/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const PublicRoute = () => {
    const user = useUserStore((state) => state.user);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;