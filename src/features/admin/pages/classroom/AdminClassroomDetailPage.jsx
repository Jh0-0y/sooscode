import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassroomDetailHeader from "@/features/admin/components/classroom/ClassroomDetailHeader.jsx";
import ClassroomDetailSection from "@/features/admin/components/classroom/ClassroomDetailSection.jsx";
import ClassroomStudentSection from "@/features/admin/components/classroom/ClassroomStudentSection.jsx";
import ClassroomStudentAddModal from "@/features/admin/components/classroom/ClassroomStudentAddModal.jsx";
import styles from './AdminClassroomDetailPage.module.css';

// 더미 데이터 (실제로는 API에서 가져옴)
const mockClassDetail = {
    classId: 1,
    thumbnail: null,
    title: 'JAVA 기초 강의',
    description: '자바 프로그래밍의 기초를 배우는 입문 과정입니다. 변수, 자료형, 조건문, 반복문부터 객체지향 프로그래밍의 기본 개념까지 학습합니다.',
    startDate: '2025-11-15',
    endDate: '2025-12-30',
    startTime: '09:00:00',
    endTime: '12:00:00',
    instructorName: '박지민',
    studentCount: 25,
    active: true,
    online: true
};

const mockClassStudents = [
    { id: 1, name: '김철수', email: 'kim@example.com', enrolledAt: '2025-01-15', progress: 75, lastAccess: '2025-01-10' },
    { id: 2, name: '정민호', email: 'jung@example.com', enrolledAt: '2025-01-16', progress: 82, lastAccess: '2025-01-10' },
    { id: 3, name: '홍길동', email: 'hong@example.com', enrolledAt: '2025-01-17', progress: 60, lastAccess: '2025-01-09' },
    { id: 4, name: '이민수', email: 'leemin@example.com', enrolledAt: '2025-01-18', progress: 90, lastAccess: '2025-01-10' },
    { id: 5, name: '강예진', email: 'kang@example.com', enrolledAt: '2025-01-20', progress: 45, lastAccess: '2025-01-08' },
    { id: 6, name: '박서연', email: 'parksy@example.com', enrolledAt: '2025-01-21', progress: 55, lastAccess: '2025-01-09' },
];

const mockAllStudents = [
    { id: 9, name: '윤도현', email: 'yoondh@example.com' },
    { id: 10, name: '정현영', email: 'jungh@example.com' },
    { id: 11, name: '정지영', email: 'jungj@example.com' },
    { id: 12, name: '고상주', email: 'kosj@example.com' },
];

const AdminClassroomDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddStudent, setShowAddStudent] = useState(false);

    // 클래스 데이터 로드
    useEffect(() => {
        // 실제로는 API 호출
        // const response = await classApi.getDetail(id);
        setClassData(mockClassDetail);
        setClassStudents(mockClassStudents);
        setLoading(false);
    }, [id]);

    // 목록으로 돌아가기
    const handleBack = () => {
        navigate('/admin/classes');
    };

    // 클래스 정보 업데이트
    const handleUpdateClass = (updatedData) => {
        // 실제로는 API 호출
        // await classApi.update(id, updatedData);
        setClassData(prev => ({
            ...prev,
            ...updatedData
        }));
        alert('클래스 정보가 수정되었습니다.');
    };

    // 학생 추가
    const handleConfirmAddStudents = (selectedStudentIds) => {
        const newStudents = mockAllStudents
            .filter(s => selectedStudentIds.includes(s.id))
            .map(s => ({
                ...s,
                enrolledAt: new Date().toISOString().split('T')[0],
                progress: 0,
                lastAccess: '-'
            }));

        setClassStudents([...classStudents, ...newStudents]);
        setClassData(prev => ({
            ...prev,
            studentCount: prev.studentCount + newStudents.length
        }));
        setShowAddStudent(false);
    };

    // 학생 삭제
    const handleRemoveStudent = (studentId) => {
        if (window.confirm('정말 이 학생을 클래스에서 제외하시겠습니까?')) {
            const newStudents = classStudents.filter(s => s.id !== studentId);
            setClassStudents(newStudents);
            setClassData(prev => ({
                ...prev,
                studentCount: prev.studentCount - 1
            }));
        }
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingState}>
                    <p>로딩 중...</p>
                </div>
            </div>
        );
    }

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

    return (
        <div className={styles.pageContainer}>
            <ClassroomDetailHeader
                classData={classData}
                onBack={handleBack}
            />

            <ClassroomDetailSection
                classData={classData}
                onUpdate={handleUpdateClass}
            />

            <ClassroomStudentSection
                students={classStudents}
                onRemoveStudent={handleRemoveStudent}
                onAddStudentClick={() => setShowAddStudent(true)}
            />

            <ClassroomStudentAddModal
                show={showAddStudent}
                onClose={() => setShowAddStudent(false)}
                allStudents={mockAllStudents}
                enrolledStudents={classStudents}
                onConfirm={handleConfirmAddStudents}
            />
        </div>
    );
};

export default AdminClassroomDetailPage;