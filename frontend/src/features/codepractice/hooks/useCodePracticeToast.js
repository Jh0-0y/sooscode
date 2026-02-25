// features/codepractice/hooks/useCodePracticeToast.js
import { useToast } from "@/hooks/useToast";

export const useCodePracticeToast = () => {
  const toast = useToast();

  return {
    copySuccess: () =>
      toast.success("클립보드에 복사되었습니다"),

    copyFail: () =>
      toast.error("복사에 실패했습니다"),

    saveSuccess: () =>
      toast.success("스냅샷이 저장되었습니다"),

    saveFail: () =>
      toast.error("스냅샷 저장에 실패했습니다 내용을 입력해주세요"),

    deleteSuccess: () =>
      toast.success("스냅샷이 삭제되었습니다"),

    deleteFail: () =>
      toast.error("스냅샷 삭제에 실패했습니다"),
  };
};
