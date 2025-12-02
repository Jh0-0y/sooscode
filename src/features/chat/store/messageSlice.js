// 메시지 목록, 입력값 담당 (리액션 완전 제거 버전)

import { API_BASE, SEND_URL } from "./constants";

export const createMessageSlice = (set, get) => ({
  // ✅ 메시지 목록
  messages: [],

  // ✅ 입력창 값
  input: "",

  // ✅ 인풋 변경
  setInput: (value) => set({ input: value }),

  // ✅ 특정 방의 채팅 히스토리 불러오기
  fetchHistory: async (classId) => {
    if (!classId) return;
    
    try {
      const res = await fetch(
        `${API_BASE}/api/chat/history?classId=${classId}`
      );

      const raw = await res.json();
      

      // 🔥 서버에서 온 원본 -> 프론트에서 쓰기 좋은 형식으로 변환
      const data = raw.map((m) => ({
        id: m.chatId,          // chatId → id 
        content: m.content,       // content → text
        createdAt: m.createdAt // 그대로
        // sender 는 아예 없으니까 안 넣거나, 필요하면 '익명' 같은 기본값
        
      }));
      

      set({ messages: data });
    } catch (err) {
      console.error("히스토리 불러오기 실패:", err);
    }
  },

  // ✅ 메시지 전송 (이건 나중에 백엔드 형태 맞춰서 다시 볼 수 있고 지금은 그대로 둬도 됨)
  sendMessage: () => {
    const { client, connected, input, currentClassId } = get();

    if (!client || !connected || !input.trim() || !currentClassId ) return;

    const msgObj = {
      content: input.trim(),
      classId: Number(currentClassId ),
    };

    client.publish({
      destination: SEND_URL,
      body: JSON.stringify(msgObj),
    });

    set({ input: "" });
  },
});
