// features/classroom/hooks/useClassroomAccess.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classApi } from '@/features/classroom/services/classApi';

/**
 * 클래스룸 접근 권한 확인 및 정보 로드 훅
 *
 * @param {number} classId - 접근할 클래스룸 ID
 * @returns {Object} 클래스룸 정보 및 로딩 상태
 */
export const useClassroomAccess = (classId) => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        classroomData: null,
        isLoading: true,
        error: null,
        hasAccess: false
    });

    useEffect(() => {
        let isMounted = true;

        const fetchClassroomData = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true, error: null }));

                const response = await classApi.joinClassroom(classId);

                if (isMounted) {
                    setState({
                        classroomData: response.data,
                        isLoading: false,
                        error: null,
                        hasAccess: true
                    });
                }
            } catch (error) {
                console.error('[useClassroomAccess] 클래스룸 접근 실패:', error);

                navigate('/error', {
                    replace: true,
                    state: { message: '클래스에 접근할 권한이 없습니다.' }
                });
            }
        };

        if (classId) {
            fetchClassroomData();
        }

        return () => {
            isMounted = false;
        };
    }, [classId, navigate]);

    return state;
};