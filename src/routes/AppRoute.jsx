// routes/AppRoute.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

// Public Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Private Pages
import Home from '@/pages/Home';
// import StudentClassroom from '@/pages/classroom/StudentClassroom';
import Classroom from '@/pages/classroom/Classroom.jsx';

// Error Pages
import Forbidden from '@/pages/error/Forbidden';
import NotFound from '@/pages/error/NotFound';
import ServerError from '@/pages/error/ServerError';
import ErrorPage from '@/pages/error/ErrorPage';

// Test Pages
import ToastTest from '@/pages/test/ToastTest';
import LoadingTest from '@/pages/test/LoadingTest';
import ColorPalette from '@/pages/test/ColorPalette';

export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Test - 개발용 */}
                <Route path="/toast" element={<ToastTest />} />
                <Route path="/loading" element={<LoadingTest />} />
                <Route path="/color" element={<ColorPalette />} />

                {/* Public - 비로그인 전용 */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Private - 로그인 필수 (공용) */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Private - 학생 전용 */}
                {/*<Route element={<PrivateRoute allowedRoles={['STUDENT']} />}>*/}
                {/*    <Route path="/class/student" element={<StudentClassroom />} />*/}
                {/*</Route>*/}

                {/* Private - 강사 전용 */}
                {/*<Route element={<PrivateRoute allowedRoles={['INSTRUCTOR']} />}>*/}
                    <Route path="/class" element={<Classroom />} />
                {/*</Route>*/}

                {/* Private - 관리자 전용 */}
                {/*<Route element={<PrivateRoute allowedRoles={['admin']} />}>*/}
                {/*    <Route path="/admin" element={<AdminDashboard />} />*/}
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