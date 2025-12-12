import { create } from "zustand";

export const useSnapshotStore = create((set) => ({
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

  
}));
