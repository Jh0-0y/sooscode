import { api } from "@/services/api";

/**
 * 내가 가진 강의 목록 조회
 * (학생 / 강사 자동 분기)
 */
export const getMyClasses = async () => {
  const res = await api.get("/api/mypage/classes");
  // axios interceptor 때문에 res === response.data
  return res.data;
};

/**
 * 강의 상세 조회 (선택용, 필요할 때만)
 */
export const getMyClassDetail = async (classId) => {
  const res = await api.get(`/api/mypage/detail/${classId}`);
  return res.data;
};
