// features/classroom/hooks/class/useSelectedStudent.js

import { create } from 'zustand';

/**
 * 선택된 학생 관리 스토어
 */
const selectedStudentStore = create((set) => ({
    selectedStudent: null, // { userId, username, userEmail }

    selectStudent: (student) => set({ selectedStudent: student }),

    clearSelection: () => set({ selectedStudent: null }),
}));

/**
 * 선택된 학생 관리 훅
 */
export const useSelectedStudent = () => {
    const selectedStudent = selectedStudentStore((state) => state.selectedStudent);
    const selectStudent = selectedStudentStore((state) => state.selectStudent);
    const clearSelection = selectedStudentStore((state) => state.clearSelection);

    return {
        selectedStudent,
        selectStudent,
        clearSelection,
    };
};