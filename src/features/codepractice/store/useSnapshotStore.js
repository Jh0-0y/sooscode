import { create } from "zustand";
import { usePracticeStore } from "./usePracticeStore";
import { buildHCJ, parseHCJ } from "../utils/parseHCJ.js";
import { saveSnapshot } from "/src/features/codepractice/services/snapshot/snapshot.api.js"

export const useSnapshotStore = create((set, get) => ({
  
  snapshots: [],             // 스냅샷 목록
  selectedSnapshot: null,    // 선택된 스냅샷
  addSnapshot: (item) =>
    set((state) => ({
      snapshots: [...state.snapshots, item],
    })),

  setSelectedSnapshot: (item) =>
    set({ selectedSnapshot: item }),

  clearSnapshots: () =>
    set({ snapshots: [], selectedSnapshot: null }),

  refreshKey: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshKey: state.refreshKey + 1 })),
  
  // HCJ 전용 save store
  saveHCJSnapshot: async () => {
  const { htmlCode, cssCode, jsCode } =
    usePracticeStore.getState();

  const fullHTML = buildHCJ({
    html: htmlCode,
    css: cssCode,
    js: jsCode,
  });

  await saveSnapshot({
    title: "HCJ 스냅샷",
    content: fullHTML,
    language: "CSS_HTML_JS",
    classId: 1,
  });

  get().triggerRefresh();
  },

  // HCJ Load Store Method
  loadSelectedHCJSnapshot: () => {
    const snapshot = get().selectedSnapshot;

    if (!snapshot) {
      alert("선택된 스냅샷이 없습니다.");
      return;
    }

    if (snapshot.language !== "CSS_HTML_JS") {
      alert("HCJ 스냅샷이 아닙니다.");
      return;
    }

    const { html, css, js } = parseHCJ(snapshot.content);

    const {
      setLanguage,
      setHTML,
      setCSS,
      setJS,
    } = usePracticeStore.getState();

    // 👉 HCJ 모드로 전환 + 코드 주입
    setLanguage("CSS_HTML_JS");
    setHTML(html);
    setCSS(css);
    setJS(js);

  },
  resetSnapshots: () =>
  set({
    snapshots: [],
    selectedSnapshot: null,
  }),


  
}));
