// features/classroom/hooks/useClass.js
import { create } from 'zustand';
import { api } from '@/services/api';

/**
 * 클래스 상태 ENUM
 */
export const CLASS_STATUS = {
    WAITING: 'WAITING',
    LIVE: 'LIVE',
    ENDED: 'ENDED',
};

/**
 * 클래스 데이터 유효성 검증
 */
const validateClassroom = (data) => {
    if (!data) return null;

    const {
        classId,
        className,
        status,
        instructorId,
        instructorName,
        participantCount,
        maxParticipants,
    } = data;

    if (!classId || !className) {
        console.error('[useClass] 필수 필드 누락:', data);
        return null;
    }

    return {
        classId,
        className,
        status: status || CLASS_STATUS.WAITING,
        instructorId: instructorId || null,
        instructorName: instructorName || null,
        participantCount: participantCount || 0,
        maxParticipants: maxParticipants || 30,
    };
};

/**
 * Zustand 내부 스토어
 */
const classroomStore = create((set, get) => ({
    classroom: null,
    loading: false,
    error: null,

    setClassroom: (data) => {
        const classroom = validateClassroom(data);
        if (!classroom) {
            console.error('[useClass] setClassroom 실패: 유효하지 않은 데이터');
            return;
        }
        set({ classroom, error: null });
    },

    clearClassroom: () => set({
        classroom: null,
        loading: false,
        error: null
    }),

    fetchClassroom: async (classId) => {
        if (!classId) return;

        set({ loading: true, error: null });

        try {
            const { data } = await api.get(`/api/classroom/${classId}`);
            const classroom = validateClassroom(data.classroom || data);
            set({ classroom, loading: false });
        } catch (err) {
            const errorMessage = err.response?.data?.message || '클래스 정보를 불러올 수 없습니다.';
            set({ classroom: null, loading: false, error: errorMessage });
            console.error('[useClass] fetchClassroom 실패:', errorMessage);
        }
    },

    updateStatus: (status) => {
        const { classroom } = get();
        if (!classroom) return;

        if (!Object.values(CLASS_STATUS).includes(status)) {
            console.error('[useClass] 유효하지 않은 상태:', status);
            return;
        }

        set({ classroom: { ...classroom, status } });
    },

    updateParticipantCount: (count) => {
        const { classroom } = get();
        if (!classroom) return;

        set({ classroom: { ...classroom, participantCount: count } });
    },
}));

/**
 * 클래스룸 훅
 */
export const useClass = () => ({
    classroom: classroomStore((state) => state.classroom),
    loading: classroomStore((state) => state.loading),
    error: classroomStore((state) => state.error),
    setClassroom: classroomStore((state) => state.setClassroom),
    clearClassroom: classroomStore((state) => state.clearClassroom),
    fetchClassroom: classroomStore((state) => state.fetchClassroom),
    updateStatus: classroomStore((state) => state.updateStatus),
    updateParticipantCount: classroomStore((state) => state.updateParticipantCount),
});

/**
 * 사용법:
 *
 * import { useClass, CLASS_STATUS } from '@/features/classroom/hooks/useClass';
 *
 * const { classroom, loading, error, fetchClassroom } = useClass();
 *
 * // ex) 클래스 정보 조회
 * useEffect(() => {
 *     fetchClassroom(classId);
 * }, [classId]);
 *
 * // ex) 클래스 정보 접근
 * console.log(classroom?.className);
 * console.log(classroom?.status);
 * console.log(classroom?.participantCount);
 *
 * // 상태 업데이트
 * updateStatus(CLASS_STATUS.LIVE);
 * updateParticipantCount(25);
 */