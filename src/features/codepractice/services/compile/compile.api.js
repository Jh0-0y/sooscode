import { api } from "@/services/api";

export const runJavaCode = async ({ code }) => {
  const res = await api.post("/api/compile/run", { code });

  // ★ output만 골라서 return
  return res.data.output ?? "";
};
