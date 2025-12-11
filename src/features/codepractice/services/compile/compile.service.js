import { useMutation } from "@tanstack/react-query";
import { runJavaCode } from "./compile.api";

export const useRunJava = () => {
  return useMutation({
    mutationFn: runJavaCode,
    onSuccess: (data) => {
      console.log("Java 실행 성공:", data);
    },
    onError: (err) => {
      console.error("Java 실행 실패:", err);
    },
  });
};