import { create } from 'zustand';

export const useUserStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
    }),
    clearUser: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
    }),
    setLoading: (isLoading) => set({ isLoading }),
}));