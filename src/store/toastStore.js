import { create } from 'zustand';

export const useToastStore = create((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                {
                    id: Date.now() + Math.random(),
                    type: toast.type || 'info',
                    message: toast.message,
                    duration: toast.duration || 3000,
                },
            ],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));