export const ROUTES = {
  LOGIN: "/login",

  STUDENT: {
    MYPAGE: "/student/mypage",
    CLASS: (id = ":id") => `/student/class/${id}`,
    CLASS_DETAIL: (id = ":id") => `/student/class/${id}/detail`,
  },

  TEACHER: {
    MYPAGE: "/teacher/mypage",
    CLASS: (id = ":id") => `/teacher/class/${id}`,
    CLASS_DETAIL: (id = ":id") => `/teacher/class/${id}/detail`,
  },
};
