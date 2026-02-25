import { createContext, useContext, useMemo } from 'react';
import { useUser } from '@/hooks/useUser';

/**
 * 클래스룸 기본 정보 Context
 * - classId
 * - 유저 정보 (userId, username, isInstructor)
 */
const ClassroomContext = createContext(null);

export const ClassroomProvider = ({ classId, children }) => {
    const { user } = useUser();

    const value = useMemo(() => {
        if (!user) return null;

        return {
            classId,
            userId: user.userId,
            username: user.name,
            isInstructor: user.role === 'INSTRUCTOR',
        };
    }, [classId, user]);

    // 유저 정보 로딩 중
    if (!value) {
        return null; // 또는 로딩 컴포넌트
    }

    return (
        <ClassroomContext.Provider value={value}>
            {children}
        </ClassroomContext.Provider>
    );
};

export const useClassroomContext = () => {
    const context = useContext(ClassroomContext);
    if (!context) {
        throw new Error('useClassroom must be used within ClassroomProvider');
    }
    return context;
};

export default ClassroomContext;