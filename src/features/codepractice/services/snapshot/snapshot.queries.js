import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSnapshots,
  getSnapshotsByTitle,
  getSnapshotsByContent,
  getSnapshotsByDate,
  saveSnapshot,
  updateSnapshot,
  deleteSnapshot,
} from "./snapshot.api";

// 목록 조회
export const useSnapshots = (classId, page = 0, size = 3) => {
  return useQuery({
    queryKey: ["snapshots", classId, page, size],
    queryFn: () => getSnapshots({ classId, page, size }),
    enabled: !!classId,
    staleTime: 60 * 1000, // 1분 캐싱
  });
};


// 날짜별 데이터 완성되면 바꿀거
// export const useSnapshots = ({
//   classId,
//   page = 0,
//   size = 3,
//   startDate,
//   endDate,
//   languages,
// }) => {
//   return useQuery({
//     queryKey: [
//       "snapshots",
//       classId,
//       page,
//       size,
//       startDate,
//       endDate,
//       languages,
//     ],
//     queryFn: () =>
//       getSnapshots({
//         classId,
//         page,
//         size,
//         startDate,
//         endDate,
//         languages,
//       }),
//     enabled: !!classId,
//     staleTime: 60 * 1000,
//   });
// };






// 제목 검색
export const useSearchSnapshotByTitle = (classId, title) => {
  return useQuery({
    queryKey: ["snapshotSearchTitle", classId, title],
    queryFn: () => getSnapshotsByTitle({ classId, title }),
    enabled: !!classId && !!title,
    retry: 0,
  });
};

// 내용 검색
export const useSearchSnapshotByContent = (classId, content) => {
  return useQuery({
    queryKey: ["snapshotSearchContent", classId, content],
    queryFn: () => getSnapshotsByContent({ classId, content }),
    enabled: !!classId && !!content,
    retry: 0,
  });
};

// 날짜 검색
export const useSearchSnapshotByDate = (classId, day) => {
  return useQuery({
    queryKey: ["snapshotSearchDate", classId, day],
    queryFn: () => getSnapshotsByDate({ classId, day }),
    enabled: !!classId && !!day,
  });
};

// 스냅샷 저장
export const useSaveSnapshot = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: saveSnapshot,
    onSuccess: (_data, variables) => {
      console.log("스냅샷 저장 성공", _data);

      qc.invalidateQueries({
        queryKey: ["snapshots", variables.classId],
      });
    },
  });
};

// 스냅샷 수정
export const useUpdateSnapshot = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateSnapshot,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["snapshots", variables.classId],
      });
    },
  });
};

// 스냅샷 삭제
export const useDeleteSnapshot = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteSnapshot,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["snapshots", variables.classId],
      });
    },
  });
};
