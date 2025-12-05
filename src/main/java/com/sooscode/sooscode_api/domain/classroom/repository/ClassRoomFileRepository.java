package com.sooscode.sooscode_api.domain.classroom.repository;

import com.sooscode.sooscode_api.domain.classroom.entity.ClassRoomFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClassRoomFileRepository extends JpaRepository<ClassRoomFile , Long> {
    // 특정 클래스에 속한 모든 파일 확인
    Page<ClassRoomFile> findByClassRoom_ClassId(Long classId, Pageable pageable);
    // 날짜 기반으로 클래스에 속한 모든 파일 확인
    Page<ClassRoomFile> findByClassRoom_ClassIdAndLectureDate(Long classId, LocalDate lectureDate, Pageable pageable);
}
