import { createContext, useContext } from 'react';
import { useClassroomAccess } from '@/features/classroom/hooks/class/useClassroomAccess';

const ClassroomContext = createContext(null);

export const ClassroomProvider = ({ classId, children }) => {
    const { classroomData, isLoading, error, hasAccess } = useClassroomAccess(classId);

    const value = {
        classId,
        classroomData,
        isLoading,
        error,
        hasAccess,
        // 편의 속성들
        isInstructor: classroomData?.isInstructor ?? false,
        className: classroomData?.title ?? '',
        status: classroomData?.status ?? 'UPCOMING',
        mode: classroomData?.mode ?? 'READ',
        totalParticipantCount: classroomData?.totalParticipantCount ?? 0,
    };

    // 로딩 중이면 로딩 화면 표시
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>클래스 정보를 불러오는 중...</div>
            </div>
        );
    }

    // 접근 권한이 없거나 에러가 있으면 children을 렌더하지 않음
    if (!hasAccess || error) {
        return null;
    }

    return (
        <ClassroomContext.Provider value={value}>
            {children}
        </ClassroomContext.Provider>
    );
};

export const useClassroom = () => {
    const context = useContext(ClassroomContext);
    if (!context) {
        throw new Error('useClassroom must be used within ClassroomProvider');
    }
    return context;
};