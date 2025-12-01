export const ROUTES = {
  LOGIN: "/login",

  JOIN : "/join",

  STUDENT: {
    MYPAGE: "/student/mypage",
    CLASS_JOIN: (id = ":id") => `/student/class/${id}`,
    CLASS_DETAIL: (id = ":id") => `/student/class/${id}/detail`,
  },

  TEACHER: {
    MYPAGE: "/teacher/mypage",
    CLASS_JOIN: (id = ":id") => `/teacher/class/${id}`,
    CLASS_DETAIL: (id = ":id") => `/teacher/class/${id}/detail`,
  },
};
