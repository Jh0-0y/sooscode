import { api } from "@/services/api";

export const runJavaCode = async ({ code }) => {
  try {
    const res = await api.post("/api/compile/run", { code });

    // res === ApiResponse
    return {
      success: true,
      output: res.data?.output ?? "",
    };

  } catch (err) {
    // err === ApiResponse (interceptor 때문)
    if (err?.message) {
      return {
        success: false,
        output: err.message,
      };
    }

    return {
      success: false,
      output: "컴파일 중 오류가 발생했습니다.",
    };
  }
};
