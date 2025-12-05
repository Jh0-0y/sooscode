package com.sooscode.sooscode_api.application.classroom.service;

import com.sooscode.sooscode_api.application.classroom.dto.file.ClassRoomFileDeleteRequest;
import com.sooscode.sooscode_api.application.classroom.dto.file.ClassRoomFileUploadRequest;
import com.sooscode.sooscode_api.application.classroom.dto.file.ClassRoomFileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ClassRoomFileService {

    List<ClassRoomFileResponse> uploadFiles(ClassRoomFileUploadRequest rq) throws Exception;

    Page<ClassRoomFileResponse> getFilesByClassId(Long classId, Pageable pageable);

    Page<ClassRoomFileResponse> getFilesByLectureDate(Long classId, LocalDate lectureDate, Pageable pageable);

    void deleteFiles(ClassRoomFileDeleteRequest rq) throws Exception;
}
