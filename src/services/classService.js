// src/services/classService.js

import { api } from "./api";

// 수업 정보 가져오기
export async function fetchClassInfo(classId) {
  const res = await api.get(`/class/${classId}`);
  return res.data;
}

// 온라인 강의 여부
export function isOnlineClass(classInfo) {
  return classInfo.type === "ONLINE";
}
