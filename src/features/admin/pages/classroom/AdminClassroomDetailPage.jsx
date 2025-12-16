import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassroomDetailHeader from "@/features/admin/components/classroom/ClassroomDetailHeader.jsx";
import ClassroomDetailSection from "@/features/admin/components/classroom/ClassroomDetailSection.jsx";
import ClassroomStudentSection from "@/features/admin/components/classroom/ClassroomStudentSection.jsx";
import useClassroomDetail from '../../hooks/classroom/useClassroomDetail.js';
import { useError } from "@/hooks/useError";
import styles from './AdminClassroomDetailPage.module.css';

const AdminClassroomDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleError } = useError();

    // 헤더용 기본 정보 가져옴
    const {
        classData,
        loading,
        error: detailError,
    } = useClassroomDetail(id);

    const handleBack = () => {
        navigate('/admin/classes');
    };

    // ============ 에러 처리 ============
    useEffect(() => {
        if (detailError) {
            // 에러 객체 생성해서 handleError에 전달
            const errorObj = {
                response: {
                    status: 404, // 또는 적절한 상태 코드
                    data: {
                        success: false,
                        status: 404,
                        code: 'CLASSROOM_NOT_FOUND',
                        message: detailError
                    }
                }
            };
            handleError(errorObj);
        }
    }, [detailError, handleError]);

    // ============ 로딩 상태 ============
    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingState}>
                    <p>로딩 중...</p>
                </div>
            </div>
        );
    }

    // ============ 데이터 없음 상태 ============
    if (!classData) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p>클래스를 찾을 수 없습니다</p>
                    <button className={styles.btnPrimary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // ============ 메인 렌더링 ============
    return (
        <div className={styles.pageContainer}>
            {/* 헤더 - 제목과 뒤로가기만 */}
            <ClassroomDetailHeader
                classData={classData}
                onBack={handleBack}
            />

            {/* 상세 정보 - classroomId 전달, 내부에서 데이터/수정/삭제 처리 */}
            <ClassroomDetailSection classroomId={id} />

            {/* 학생 목록 - classroomId 전달, 내부에서 모든 것 처리 */}
            <ClassroomStudentSection classroomId={id} />
        </div>
    );
};

export default AdminClassroomDetailPage;