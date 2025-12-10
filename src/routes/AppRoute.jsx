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

import Mypage from '@/pages/mypage/Mypage.jsx'
import StudentClassDetail from '@/pages/classdetail/StudentClassDetail.jsx'
import InstructorClassDetail from '@/pages/classdetail/InstructorClassDetail.jsx'

// 윤서 테스트
import ChatPanel from "@/features/chat/ChatPanel.jsx";
// 수빈 테스트
import LogoutButton from "@/features/auth/components/base/LogoutButton.jsx";
// 현영 테스트
import AdminPage from "@/pages/admin/AdminPage.jsx";
// 효상 테스트
import CodePractice from '../pages/classdetail/CodePractice.jsx';



export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Test - 개발용 */}
                <Route path="/toast" element={<ToastTest />} />
                <Route path="/loading" element={<LoadingTest />} />
                <Route path="/color" element={<ColorPalette />} />
                <Route path="/logout" element={<LogoutButton />} />

                <Route path="/admin" element={<AdminPage />} />
                <Route path="/" element={<Home />} />

                {/* Public - 비로그인 전용 */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Private - 로그인 필수 (공용) */}
                {/*<Route element={<PrivateRoute />}>*/}

                {/*</Route>*/}

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

                {/* mypage 및 classdetail*/}
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/classdetail/student" element={<StudentClassDetail />} />
                <Route path="/classdetail/instructor" element={<InstructorClassDetail />} />
                <Route path="/classdetail/codepractice" element={<CodePractice />} />


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