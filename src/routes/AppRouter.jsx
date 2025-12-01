import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";

// pages
import LoginPage from "../pages/login/LoginPage.jsx";

import StudentMyPage from "../pages/student/StudentMyPage.jsx";
import StudentClassPage from "../pages/student/StudentClassPage.jsx";
import StudentClassDetailPage from "../pages/student/StudentClassDetailPage.jsx";

import TeacherMyPage from "../pages/teacher/TeacherMyPage.jsx";
import TeacherClassPage from "../pages/teacher/TeacherClassPage.jsx";
import TeacherClassDetailPage from "../pages/teacher/TeacherClassDetailPage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Student */}
        <Route path={ROUTES.STUDENT.MYPAGE} element={<StudentMyPage />} />
        <Route path={ROUTES.STUDENT.CLASS()} element={<StudentClassPage />} />
        <Route path={ROUTES.STUDENT.CLASS_DETAIL()} element={<StudentClassDetailPage />} />

        {/* Teacher */}
        <Route path={ROUTES.TEACHER.MYPAGE} element={<TeacherMyPage />} />
        <Route path={ROUTES.TEACHER.CLASS()} element={<TeacherClassPage />} />
        <Route path={ROUTES.TEACHER.CLASS_DETAIL()} element={<TeacherClassDetailPage />} />

      </Routes>
    </BrowserRouter>
  );
}
