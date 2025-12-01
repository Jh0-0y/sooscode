import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";

// pages

import StudentClassDetail from "../pages/classDetail/StudentClassDetail.jsx";
import TeacherClassDetail from "../pages/classDetail/TeacherClassDetail.jsx";

import StudentClassJoin from "../pages/classJoin/StudentClassJoin.jsx";
import TeacherClassJoin from "../pages/classJoin/TeacherClassJoin.jsx";

import AuthPage from "@/pages/auth/AuthPage.jsx";
import AuthLayout from "@/features/auth/layout/AuthLayout.jsx";
import {useEffect, useState} from "react";
import StudentMypage from "../pages/Mypage/StudentMypage.jsx";
import TeacherMypage from "../pages/Mypage/TeacherMypage.jsx";

export default function AppRouter() {
    // 추후 Redis도입 시 삭제 될 코드
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLogin(!!token);
    }, []);

  return (
    <BrowserRouter>
      <Routes>
          {/* login & register */}
          <Route element={<AuthLayout/>}>
              <Route path="/login" element={<AuthPage setIsLogin={setIsLogin} mode="login"/>}/>
              <Route path="/register" element={<AuthPage mode="register"/>}/>
          </Route>

          {/* Student */}
        <Route path={ROUTES.STUDENT.MYPAGE} element={<StudentMypage />} />
        <Route path={ROUTES.STUDENT.CLASS_JOIN()} element={<StudentClassJoin />} />
        <Route path={ROUTES.STUDENT.CLASS_DETAIL()} element={<StudentClassDetail />} />

        {/* Teacher */}
        <Route path={ROUTES.TEACHER.MYPAGE} element={<TeacherMypage />} />
        <Route path={ROUTES.TEACHER.CLASS_JOIN()} element={<TeacherClassJoin />} />
        <Route path={ROUTES.TEACHER.CLASS_DETAIL()} element={<TeacherClassDetail />} />

      </Routes>
    </BrowserRouter>
  );
}
