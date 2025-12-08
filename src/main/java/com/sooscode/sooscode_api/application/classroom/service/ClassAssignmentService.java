package com.sooscode.sooscode_api.application.classroom.service;

import com.sooscode.sooscode_api.application.classroom.dto.classroom.TeacherListItemResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClassAssignmentService {
    /** 전체 클래스 기준 담당된 강사 목록 조회(중복 제거) */
    List<TeacherListItemResponse> getAssignmentTeachers();
}
