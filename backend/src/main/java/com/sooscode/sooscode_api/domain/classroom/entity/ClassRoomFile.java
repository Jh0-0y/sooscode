package com.sooscode.sooscode_api.domain.classroom.entity;

import com.sooscode.sooscode_api.domain.classroom.entity.ClassRoom;
import com.sooscode.sooscode_api.domain.file.entity.SooFile;
import com.sooscode.sooscode_api.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 작성자 : 김효상 ( 2025-12-05 ) v1
 * Class 소유의 파일 관리 엔티티
 */

@Entity
@Table(name = "class_room_file")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ClassRoomFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classroom_file_id")
    private Long classroomFileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private SooFile file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "lecture_date", nullable = false)
    private LocalDate lectureDate;

    public void changeClassRoom(ClassRoom newClassRoom) {
        this.classRoom = newClassRoom;
    }
    public void changeFile(SooFile newFile) {
        this.file = newFile;
    }

}
