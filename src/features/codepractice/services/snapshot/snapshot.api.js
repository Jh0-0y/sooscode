import { api } from "@/services/api";

// Snapshot 목록 조회 (페이지네이션)
export const getSnapshots = async ({ classId, page = 0, size = 3 }) => {
  const res = await api.get("/api/snapshot/read", {
    params: { classId, page, size },
  });
  return res.data;
};

// 제목 검색
export const getSnapshotsByTitle = async ({ classId, title }) => {
  const res = await api.get("/api/snapshot/read/title", {
    params: { classId, title },
  });
  return res.data.data;
};

// 내용 검색
export const getSnapshotsByContent = async ({ classId, content }) => {
  const res = await api.get("/api/snapshot/read/content", {
    params: { classId, content },
  });
  return res.data.data;
};

// 날짜 검색
export const getSnapshotsByDate = async ({ classId, day }) => {
  const res = await api.get("/api/snapshot/read/date", {
    params: { classId, day },
  });
  return res.data.data;
};

// 저장
export const saveSnapshot = async ({ title, content, classId ,language}) => {
  const res = await api.post(`/api/snapshot/`, { title, content, classId, language });
  return res;
};

// 수정
export const updateSnapshot = async ({ snapshotId, title, content }) => {
  const res = await api.post(`/api/snapshot/update`, { title, content }, {
    params: { snapshotId },
  });
  return res.data;
};

// 삭제
export const deleteSnapshot = async ({ classId, snapshotId }) => {
  const res = await api.post(`/api/snapshot/delete`, null, {
    params: { classId, snapshotId },
  });
  return res.data;
};


/* usage
const { refetch, data, isLoading: snapLoading, isError, error } = useSnapshots(classId, 0, 3);
  classId = 1;
   const handleTestSnapshot = async () => {
    const result = await refetch();
    console.log("📌 Snapshot Test Result:", result);
  };

  <button onClick={handleTestSnapshot}>🔍 스냅샷 API 테스트 하기</button>
*/



/**
 * 언어 + 날짜 범위로 스냅샷 조회
 */
export const getSnapshotsByLanguageAndDate = async ({
  classId,
  language,
  startDate,
  endDate,
}) => {
  const res = await api.get("/api/snapshot/read/language/date", {
    params: {
      classId,
      language,
      startDate,
      endDate,
    },
  });

  // ⚠️ axios interceptor 때문에 res === response.data
  return res.data.content;
};
