import { create } from "zustand";

/* 스토어를 파일 내부에서만 생성 (캡슐화) */
const useSidebarStore = create((set) => ({
    collapsed: false,
    toggle: () => set((s) => ({ collapsed: !s.collapsed })),
    open: () => set({ collapsed: false }),
    close: () => set({ collapsed: true })
}));


/* 외부로 노출되는 커스텀 훅 */
export function useSidebar() {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const toggle = useSidebarStore((s) => s.toggle);
    const open = useSidebarStore((s) => s.open);
    const close = useSidebarStore((s) => s.close);

    return { collapsed, toggle, open, close };
}