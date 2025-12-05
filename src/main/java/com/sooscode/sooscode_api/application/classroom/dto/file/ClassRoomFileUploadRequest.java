package com.sooscode.sooscode_api.application.classroom.dto.file;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class ClassRoomFileUploadRequest {

    private Long classId;
    private String lectureDate;
    private List<MultipartFile> files;
    private Long teacherId;
}
