import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassroomDetailHeader from "@/features/admin/components/classroom/ClassroomDetailHeader.jsx";
import ClassroomDetailSection from "@/features/admin/components/classroom/ClassroomDetailSection.jsx";
import ClassroomStudentSection from "@/features/admin/components/classroom/ClassroomStudentSection.jsx";
import useClassroomDetail from '../../hooks/classroom/useClassroomDetail.js';
import styles from './AdminClassroomDetailPage.module.css';

const AdminClassroomDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 헤더용 기본 정보만 가져옴
    const {
        classData,
        error: detailError,
        refetch: refetchDetail,
    } = useClassroomDetail(id);

    const handleBack = () => {
        navigate('/admin/classes');
    };

    // ============ 에러 상태 ============
    if (detailError) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.errorState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p>에러: {detailError}</p>
                    <button className={styles.btnPrimary} onClick={refetchDetail}>
                        다시 시도
                    </button>
                    <button className={styles.btnSecondary} onClick={handleBack}>
                        목록으로 돌아가기
                    </button>
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