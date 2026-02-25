import { create } from "zustand";

export const usePracticeUIStore = create((set) => ({

  // 1) 왼쪽 사이드바 열/닫
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  // 2) 스냅샷 패널 열/닫
  isSnapshotOpen: true,
  toggleSnapshot: () => set((s) => ({ isSnapshotOpen: !s.isSnapshotOpen })),

  isHCJSnapshotOpen: true,
  toggleHCJSnapshot: () =>
    set((s) => ({ isHCJSnapshotOpen: !s.isHCJSnapshotOpen })),
}));
