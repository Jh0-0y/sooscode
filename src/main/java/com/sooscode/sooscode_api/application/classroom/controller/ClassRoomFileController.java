package com.sooscode.sooscode_api.application.classroom.controller;

import com.sooscode.sooscode_api.application.classroom.dto.file.ClassRoomFileDeleteRequest;
import com.sooscode.sooscode_api.application.classroom.dto.file.ClassRoomFileUploadRequest;
import com.sooscode.sooscode_api.application.classroom.dto.file.ClassRoomFileResponse;
import com.sooscode.sooscode_api.application.classroom.service.ClassRoomFileService;
import com.sooscode.sooscode_api.global.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/classroom")
@RequiredArgsConstructor
@Slf4j
public class ClassRoomFileController {

    private final ClassRoomFileService classRoomFileService;


    /**
     * 1) 클래스 자료 업로드 (DTO 기반)
     */
    @PostMapping("/files/upload")
    public ResponseEntity<?> uploadClassFiles(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            ClassRoomFileUploadRequest rq
    ) throws Exception {

        rq.setTeacherId(userDetails.getUser().getUserId());

        log.info("uploadClassFiles Controller | classId={}, teacherId={}, date={}, fileCount={}",
                rq.getClassId(), rq.getTeacherId(), rq.getLectureDate(), rq.getFiles().size());

        List<ClassRoomFileResponse> response = classRoomFileService.uploadFiles(rq);

        return ResponseEntity.ok(response);
    }


    /**
     * 2) 클래스 자료 전체 조회
     */
    @GetMapping("/{classId}/files")
    public ResponseEntity<?> getClassFiles(
            @PathVariable Long classId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        var response = classRoomFileService.getFilesByClassId(classId, pageable);

        return ResponseEntity.ok(response);
    }


    /**
     * 3) 특정 날짜 자료 조회
     */
    @GetMapping("/{classId}/files/by-date")
    public ResponseEntity<?> getFilesByLectureDate(
            @PathVariable Long classId,
            @RequestParam("lectureDate") String lectureDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        LocalDate date;
        try {
            date = LocalDate.parse(lectureDate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected yyyy-MM-dd");
        }

        Pageable pageable = PageRequest.of(page, size);

        var response = classRoomFileService.getFilesByLectureDate(classId, date, pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * 4) 파일 삭제 (다중 삭제)
     */
    @DeleteMapping("/files/batch")
    public ResponseEntity<?> deleteClassFiles(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ClassRoomFileDeleteRequest rq
    ) throws Exception {

        rq.setTeacherId(userDetails.getUser().getUserId());

        classRoomFileService.deleteFiles(rq);

        return ResponseEntity.ok("Files deleted successfully");
    }
}
