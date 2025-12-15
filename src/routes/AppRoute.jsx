// routes/AppRoute.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

// Public Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Private Pages
import Home from '@/pages/Home';
import Classroom from '@/features/classroom/pages/ClassroomPage.jsx';

// Error Pages
import Forbidden from '@/pages/error/Forbidden';
import NotFound from '@/pages/error/NotFound';
import ServerError from '@/pages/error/ServerError';
import ErrorPage from '@/pages/error/ErrorPage';

// Test Pages
import ToastTest from '@/pages/test/ToastTest';
import LoadingTest from '@/pages/test/LoadingTest';
import ColorPalette from '@/pages/test/ColorPalette';

// 수빈 테스트
import LogoutButton from "@/features/auth/components/base/LogoutButton.jsx";

// 현영 테스트
import CodeTestPage from '../pages/codepractice/CodeTestPage';
import ClassJoinTest from "@/features/classroom/pages/ClassJoinTest.jsx";
import AdminLayout from "@/features/admin/layouts/AdminLayout.jsx";
import AdminClassroomPage from "@/features/admin/pages/classroom/AdminClassroomPage.jsx";
import AdminUserPage from "@/features/admin/pages/user/AdminUserPage.jsx";
import AdminClassroomDetailPage from "@/features/admin/pages/classroom/AdminClassroomDetailPage.jsx";
import AdminUserDetailPage from "@/features/admin/pages/user/AdminUserDetailPage.jsx";

// 효상 테스트
import CodePracticePage from '../pages/codepractice/CodePracticePage';
import StudentClassDetail from '@/pages/classdetail/StudentClassDetail.jsx'
import InstructorClassDetail from '@/pages/classdetail/InstructorClassDetail.jsx'
import Mypage from '../pages/mypage/Mypage';

export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Test - 개발용 */}
                <Route path="/toast" element={<ToastTest />} />
                <Route path="/loading" element={<LoadingTest />} />
                <Route path="/color" element={<ColorPalette />} />
                <Route path="/logout" element={<LogoutButton />} />

                <Route path="/classdetail/student" element={<StudentClassDetail />} />
                <Route path="/classdetail/instructor" element={<InstructorClassDetail />} />
                <Route path="/codepractice" element={<CodePracticePage />} />
                <Route path="/test" element={<CodeTestPage />} />
                <Route path="/mypage" element={<Mypage/>} />

                <Route path="/" element={<Home />} />
                <Route path="/classjoin" element={<ClassJoinTest />} />

                {/* Public - 비로그인 전용 */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Private - 로그인 필수 (공용) */}
                {/*<Route element={<PrivateRoute />}>*/}
                    <Route path="/class/:encodedId" element={<Classroom />} />
                {/*</Route>*/}

                {/* Private - 관리자 전용 */}
                {/*<Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>*/}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="classes" element={<AdminClassroomPage />} />
                        <Route path="classes/:id" element={<AdminClassroomDetailPage />} />
                        <Route path="users" element={<AdminUserPage />} />
                        <Route path="users/:id" element={<AdminUserDetailPage />} />
                    </Route>
                {/*</Route>*/}

                {/* Error Pages */}
                <Route path="/error/403" element={<Forbidden />} />
                <Route path="/error/404" element={<NotFound />} />
                <Route path="/error/500" element={<ServerError />} />
                <Route path="/error" element={<ErrorPage />} />

                {/* 404 - 매칭 안 되는 모든 경로 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}