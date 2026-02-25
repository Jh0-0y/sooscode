import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  activeTab: "snapshot",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
