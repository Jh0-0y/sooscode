// routes/AppRoute.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

/* ======================
   Public Pages
====================== */
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Home from '@/pages/Home';

/* ======================
   Private Pages
====================== */
import Classroom from '@/features/classroom/pages/ClassroomPage.jsx';
import Mypage from '../pages/mypage/Mypage';

/* ======================
   Admin Pages
====================== */
import AdminLayout from "@/features/admin/layouts/AdminLayout.jsx";
import AdminClassroomPage from "@/features/admin/pages/classroom/AdminClassroomPage.jsx";
import AdminClassroomDetailPage from "@/features/admin/pages/classroom/AdminClassroomDetailPage.jsx";
import AdminUserPage from "@/features/admin/pages/user/AdminUserPage.jsx";
import AdminUserDetailPage from "@/features/admin/pages/user/AdminUserDetailPage.jsx";

/* ======================
   Test / Dev
====================== */
import ToastTest from '@/pages/test/ToastTest';
import LoadingTest from '@/pages/test/LoadingTest';
import ColorPalette from '@/pages/test/ColorPalette';
import LogoutButton from "@/features/auth/components/base/LogoutButton.jsx";
import CodePracticePage from '../pages/codepractice/CodePracticePage';
import CodeTestPage from '../pages/codepractice/CodeTestPage';

/* ======================
   Error Pages
====================== */
import Forbidden from '@/pages/error/Forbidden';
import NotFound from '@/pages/error/NotFound';
import ServerError from '@/pages/error/ServerError';
import ErrorPage from '@/pages/error/ErrorPage';

export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ======================
                    Public (로그인 여부 무관)
                    ====================== */}
                <Route path="/" element={<Home />} />
                <Route path="/toast" element={<ToastTest />} />
                <Route path="/loading" element={<LoadingTest />} />
                <Route path="/color" element={<ColorPalette />} />
                <Route path="/test" element={<CodeTestPage />} />

                {/* ======================
                    Public (비로그인 전용)
                    → 로그인 상태면 메인으로
                    ====================== */}
                <Route element={<PublicRoute redirectIfAuth />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* ======================
                    Private (로그인 필수)
                    ====================== */}
                <Route element={<PrivateRoute />}>
                    <Route path="/mypage" element={<Mypage />} />
                    <Route path="/logout" element={<LogoutButton />} />
                    <Route path="/codepractice" element={<CodePracticePage />} />
                    <Route path="/class/:encodedId" element={<Classroom />} />
                </Route>

                {/* ======================
                    Admin (ADMIN 전용)
                    ====================== */}
                <Route element={<RoleRoute allow={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="classes" element={<AdminClassroomPage />} />
                        <Route path="classes/:id" element={<AdminClassroomDetailPage />} />
                        <Route path="users" element={<AdminUserPage />} />
                        <Route path="users/:id" element={<AdminUserDetailPage />} />
                    </Route>
                </Route>

                {/* ======================
                    Error Pages
                    ====================== */}
                <Route path="/error/403" element={<Forbidden />} />
                <Route path="/error/404" element={<NotFound />} />
                <Route path="/error/500" element={<ServerError />} />
                <Route path="/error" element={<ErrorPage />} />

                {/* ======================
                    Fallback
                    ====================== */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}