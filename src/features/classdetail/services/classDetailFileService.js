import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ===========================================================
   1) 전체 파일 목록 조회 (GET /api/classroom/{classId}/files)
=========================================================== */
export const fetchClassFiles = async (classId, page = 0, size = 10) => {
  const res = await api.get(
    `/api/classroom/${classId}/files?page=${page}&size=${size}`
  );
  return res.data;
};

export const useClassFiles = (classId, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["classFiles", classId, page, size],
    queryFn: () => fetchClassFiles(classId, page, size),
    enabled: !!classId,
    retry: 0,
  });
};

/* ===========================================================
   2) 특정 날짜 파일 조회 (GET /files/by-date)
=========================================================== */
export const fetchFilesByDate = async (classId, lectureDate, page = 0, size = 10) => {
  const res = await api.get(
    `/api/classroom/${classId}/files/by-date?lectureDate=${lectureDate}&page=${page}&size=${size}`
  );
  return res.data;
};

export const useFilesByDate = (classId, lectureDate, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["classFilesByDate", classId, lectureDate, page, size],
    queryFn: () => fetchFilesByDate(classId, lectureDate, page, size),
    enabled: !!classId && !!lectureDate,
    retry: 0,
  });
};

/* ===========================================================
   3) 파일 업로드 (POST /files/upload)
   - Multipart/FormData 방식
=========================================================== */
export const uploadFiles = async (formData) => {
  const res = await api.post(`/api/classroom/files/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data, variables) => {
      console.log("파일 업로드 성공", data);
      const classId = variables.get("classId");
      const lectureDate = variables.get("lectureDate");
      // 날짜별 파일 목록 새로 불러오기
      queryClient.invalidateQueries(["filesByDate", classId, lectureDate]);

      // 전체 파일 목록도 사용한다면 리프레시
      queryClient.invalidateQueries(["classFiles", classId]);

      // classId 기준 invalidate
      queryClient.invalidateQueries({
        queryKey: ["classFiles", variables.get("classId")],
      });
    },
    onError: (error) => {
      console.error("파일 업로드 실패", error);
    },
  });
};

/* ===========================================================
   4) 파일 삭제 (DELETE /files/batch)
   - JSON Body : { teacherId, classId, fileIds: [] }
=========================================================== */
export const deleteFiles = async (body) => {
  const res = await api.delete(`/api/classroom/files/batch`, {
    data: body,
  });
  return res.data;
};

export const useDeleteFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFiles,
    onSuccess: (data, variables) => {
      console.log("파일 삭제 성공", data);

      const { classId, lectureDate } = variables;

      // 날짜별 파일 invalidate
      queryClient.invalidateQueries({
        queryKey: ["classFilesByDate", classId, lectureDate],
        exact: false
      });

      // 전체 파일 invalidate
      queryClient.invalidateQueries({
        queryKey: ["classFiles", classId],
        exact: false
      });
    },
    onError: (error) => {
      console.error("파일 삭제 실패", error);
    },
  });
};



/* example usage
1) get
const { data: files } = useClassFiles(classId, 0, 10);
2) get by dates
const { data: dateFiles } = useFilesByDate(classId, "2025-12-09");
3) upload
const uploadMutation = useUploadFiles();

const handleUpload = () => {
  const formData = new FormData();
  formData.append("classId", classId);
  formData.append("lectureDate", "2025-12-09");
  formData.append("files", fileObj1);
  formData.append("files", fileObj2);

  uploadMutation.mutate(formData);
};

4) delete
const deleteMutation = useDeleteFiles();

deleteMutation.mutate({
  classId,
  fileIds: [1, 2, 3],
});

*/