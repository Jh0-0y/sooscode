// src/features/mypage/services/mypageService.js
import { api } from "@/services/api"; // 공용 axios instance
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

// 서버 요청: GET /api/classroom/me/classes
/*
export const getMyClasses = async (page = 0, size = 10) => {
  const res = await api.get("/api/mypage", {
    params: { page, size },
  });
  return res.data;
};
*/

// export const getMyClasses = async () => {
//   const res = await api.get("/api/mypage/classes");
//   return res.data;   // RestUtils.ok() 구조
// };

// 페이징 마이페이지 리스팅
// 서버 요청
export const getMyClasses = async ({ pageParam = 0 }) => {
  const res = await api.get("/api/mypage/classes", {
    params: {
      page: pageParam,
      size: 10,
    },
  });
  console.log("res:",res)
  console.log("res.data:",res.data)
  console.log("res.data.data:",res.data.data)


  return res.data;
};

// Infinite Query 훅
export const useMyClassesInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["myClasses"],
    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      getMyClasses({ pageParam }),

    // Page 기준으로 판단
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.last) return undefined;
      return lastPage.number + 1;
    },

    staleTime: 60 * 1000,
  });
};


// React Query 훅
export const useMyClasses = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["myClasses", page, size],
    queryFn: () => getMyClasses(page, size),
    staleTime: 60 * 1000,
  });
};

/**
 * 마이페이지 프로필 이름 수정
 * @param {{ name: string }} payload
 */
export const updateProfile = async (payload) => {
  return api.post("/api/mypage/profile/update", payload);
};

/**
 * 비밀번호 변경
 * POST /api/mypage/password/update
 */
export const updatePassword = async (payload) => {
  // payload: { currentPassword, newPassword }
  return api.post("/api/mypage/password/update", payload);
};

/**
 * 회원 탈퇴
 * POST /api/mypage/delete
 */
export const deleteUser = async () => {
  return api.post("/api/mypage/delete");
};

/**
 * 프로필 이미지 업로드
 * POST /api/mypage/profile/image/update
 * multipart/form-data
 */
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return api.post("/api/mypage/profile/image/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 프로필 이미지 삭제
 * POST /api/mypage/profile/image/delete
 */
export const deleteProfileImage = async () => {
  return api.post("/api/mypage/profile/image/delete");
};