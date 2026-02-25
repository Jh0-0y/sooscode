import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchSnapshots = async (classId, page, size) => {
  const res = await api.get(
    `/api/snapshot/read?classId=${classId}&page=${page}&size=${size}`
  );
  return res.data;
};

export const useSnapshots = (classId, page = 0, size = 3) => {
  return useQuery({
    queryKey: ["snapshots", classId, page, size],
    queryFn: () => fetchSnapshots(classId, page, size),
    enabled: !!classId, // classId 없으면 요청 금지
    retry: 0, // 실패해도 재시도 안 함
  });
};

export const saveSnapshot = async ({ title, content, classId}) => {
  const body = { title, content, classId};

  const res = await api.post(`/api/snapshot/`, body);
  return res.data;
}

export const useSaveSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn : saveSnapshot,

    onSuccess: (_data, variables) => {
      console.log("스냅샷 저장 성공:", _data)

      queryClient.invalidateQueries({
        queryKey:["snapshots", variables.classId]
      });
    },

    onError : (error) => {
      console.error("스냅샷 저장 실패", error);
    }
  })
}