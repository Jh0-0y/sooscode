package com.sooscode.sooscode_api.application.admin.service;

import com.sooscode.sooscode_api.application.admin.dto.AdminClassRequest;
import com.sooscode.sooscode_api.application.admin.dto.AdminClassResponse;
import com.sooscode.sooscode_api.domain.classroom.entity.ClassParticipant;
import com.sooscode.sooscode_api.domain.classroom.entity.ClassRoom;
import com.sooscode.sooscode_api.domain.classroom.enums.ClassMode;
import com.sooscode.sooscode_api.domain.classroom.enums.ClassStatus;
import com.sooscode.sooscode_api.domain.classroom.repository.ClassParticipantRepository;
import com.sooscode.sooscode_api.domain.classroom.repository.ClassRoomRepository;
import com.sooscode.sooscode_api.domain.user.entity.User;
import com.sooscode.sooscode_api.domain.user.enums.UserRole;
import com.sooscode.sooscode_api.domain.user.repository.UserRepository;
import com.sooscode.sooscode_api.global.api.exception.CustomException;
import com.sooscode.sooscode_api.global.api.status.AdminStatus;
import com.sooscode.sooscode_api.global.api.status.ClassRoomStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminClassServiceImpl implements AdminClassService {

    private final ClassRoomRepository classroomRepository;
    private final UserRepository userRepository;
    private final ClassParticipantRepository classParticipantRepository;

    @Override
    @Transactional
    public AdminClassResponse.ClassItem createClass(AdminClassRequest.Create request) {
        // 강사 검증
        User instructor = null;
        if (request.getInstructorId() != null) {
            instructor = userRepository.findById(request.getInstructorId())
                    .orElseThrow(() -> new CustomException(AdminStatus.USER_NOT_FOUND));
            if (!instructor.getRole().equals(UserRole.INSTRUCTOR)) {
                throw new CustomException(AdminStatus.CLASS_INSTRUCTOR_INVALID);
            }
        }

        // 클래스 생성
        ClassRoom classRoom = ClassRoom.builder()
                .isOnline(request.getIsOnline())
                .isActive(true)
                .user(instructor)
                .title(request.getTitle())
                .description(request.getDescription())
                .file(null)
                .status(ClassStatus.UPCOMING)
                .mode(ClassMode.FREE)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        classroomRepository.save(classRoom);

        // 응답 생성
        Integer studentCount = 0;
        String thumbnail = null;
        String instructorName = (instructor != null) ? instructor.getName() : null;

        return AdminClassResponse.ClassItem.from(
                classRoom,
                thumbnail,
                instructorName,
                studentCount
        );
    }

    @Override
    @Transactional
    public AdminClassResponse.ClassItem updateClass(Long classId, AdminClassRequest.Update request) {
        // 클래스 조회
        ClassRoom classRoom = classroomRepository.findById(classId)
                .orElseThrow(() -> new CustomException(ClassRoomStatus.CLASS_NOT_FOUND));

        // 강사 검증 및 변경
        User instructor = null;
        if (request.getInstructorId() != null) {
            instructor = userRepository.findById(request.getInstructorId())
                    .orElseThrow(() -> new CustomException(AdminStatus.USER_NOT_FOUND));

            // 강사 권한 확인 (원본 코드에 논리 오류가 있어서 수정)
            if (!instructor.getRole().equals(UserRole.INSTRUCTOR)) {
                throw new CustomException(AdminStatus.CLASS_INSTRUCTOR_INVALID);
            }
            classRoom.setUser(instructor);
        }

        classRoom.setTitle(request.getTitle());
        classRoom.setDescription(request.getDescription());
        classRoom.setOnline(request.getIsOnline());
        classRoom.setStartDate(request.getStartDate());
        classRoom.setEndDate(request.getEndDate());
        classRoom.setStartTime(request.getStartTime());
        classRoom.setEndTime(request.getEndTime());

        // 응답 생성
        List<ClassParticipant> participants = classParticipantRepository.findByClassRoom_ClassId(classId);
        Integer studentCount = participants.size();
        String thumbnail = null;
        String instructorName = classRoom.getUser() != null ? classRoom.getUser().getName() : null;

        return AdminClassResponse.ClassItem.from(
                classRoom,
                thumbnail,
                instructorName,
                studentCount
        );
    }

    @Override
    @Transactional
    public void deleteClass(Long classId) {
        // 클래스 조회
        ClassRoom classRoom = classroomRepository.findById(classId)
                .orElseThrow(() -> new CustomException(ClassRoomStatus.CLASS_NOT_FOUND));

        // 진행 중인 클래스는 삭제 불가
        if (classRoom.getStatus() == ClassStatus.ONGOING) {
            throw new CustomException(ClassRoomStatus.CLASS_STATUS_INVALID);
        }

        // Soft Delete: isActive를 false로 변경
        classRoom.setActive(false);
    }

    @Override
    public AdminClassResponse.ClassListPage getClassList(AdminClassRequest.SearchFilter filter, int page, int size) {
        // 정렬 방향 설정
        Sort.Direction direction = "ASC".equalsIgnoreCase(filter.getSortDirection())
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        // 정렬 기준 설정
        Sort sort = Sort.by(direction, filter.getSortBy());
        Pageable pageable = PageRequest.of(page, size, sort);

        // 전체 클래스 조회 (필터링은 QueryDSL이나 Specification 사용을 권장하지만,
        // 여기서는 기본 JPA로 구현)
        Page<ClassRoom> classRoomPage = classroomRepository.findAll(pageable);

        // ClassItem으로 변환
        List<AdminClassResponse.ClassItem> classItems = classRoomPage.getContent().stream()
                .filter(classRoom -> {
                    // 키워드 필터링
                    if (filter.getKeyword() != null && !filter.getKeyword().isEmpty()) {
                        String keyword = filter.getKeyword().toLowerCase();
                        boolean titleMatch = classRoom.getTitle().toLowerCase().contains(keyword);
                        boolean instructorMatch = classRoom.getUser() != null
                                && classRoom.getUser().getName().toLowerCase().contains(keyword);
                        if (!titleMatch && !instructorMatch) {
                            return false;
                        }
                    }

                    // 상태 필터링
                    if (filter.getStatus() != null && !classRoom.getStatus().equals(filter.getStatus())) {
                        return false;
                    }

                    // 날짜 필터링 (시작일)
                    if (filter.getStartDate() != null && classRoom.getStartDate().isBefore(filter.getStartDate())) {
                        return false;
                    }

                    // 날짜 필터링 (종료일)
                    if (filter.getEndDate() != null && classRoom.getEndDate().isAfter(filter.getEndDate())) {
                        return false;
                    }

                    return true;
                })
                .map(classRoom -> {
                    // 학생 수 조회
                    Integer studentCount = classParticipantRepository.findByClassRoom_ClassId(classRoom.getClassId()).size();

                    // 썸네일 경로
                    String thumbnail = null;

                    // 강사 이름
                    String instructorName = classRoom.getUser() != null ? classRoom.getUser().getName() : null;

                    return AdminClassResponse.ClassItem.from(classRoom, thumbnail, instructorName, studentCount);
                })
                .collect(Collectors.toList());

        // 페이지네이션 응답 생성
        return AdminClassResponse.ClassListPage.builder()
                .content(classItems)
                .page(classRoomPage.getNumber())
                .size(classRoomPage.getSize())
                .totalElements(classRoomPage.getTotalElements())
                .totalPages(classRoomPage.getTotalPages())
                .last(classRoomPage.isLast())
                .build();
    }

    @Override
    public AdminClassResponse.ClassItem getClassDetail(Long classId) {
        // 클래스 조회
        ClassRoom classRoom = classroomRepository.findById(classId)
                .orElseThrow(() -> new CustomException(ClassRoomStatus.CLASS_NOT_FOUND));

        // 학생 수 조회
        Integer studentCount = classParticipantRepository.findByClassRoom_ClassId(classId).size();

        // 썸네일 경로
        String thumbnail = null;

        // 강사 이름
        String instructorName = classRoom.getUser() != null ? classRoom.getUser().getName() : null;

        return AdminClassResponse.ClassItem.from(classRoom, thumbnail, instructorName, studentCount);
    }

    @Override
    @Transactional
    public void assignInstructor(Long classId, AdminClassRequest.AssignInstructor request) {
        // 클래스 조회
        ClassRoom classRoom = classroomRepository.findById(classId)
                .orElseThrow(() -> new CustomException(ClassRoomStatus.CLASS_NOT_FOUND));

        // 강사 조회 및 검증
        User instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new CustomException(AdminStatus.USER_NOT_FOUND));

        // 강사 권한 확인
        if (!instructor.getRole().equals(UserRole.INSTRUCTOR)) {
            throw new CustomException(AdminStatus.CLASS_INSTRUCTOR_INVALID);
        }

        // 이미 배정된 강사인지 확인
        if (classRoom.getUser() != null && classRoom.getUser().getUserId().equals(request.getInstructorId())) {
            throw new CustomException(AdminStatus.CLASS_INSTRUCTOR_DUPLICATED);
        }

        // 강사 배정
        classRoom.setUser(instructor);
    }

    @Override
    @Transactional
    public void assignStudents(Long classId, AdminClassRequest.AssignStudents request) {
        // 클래스 조회
        ClassRoom classRoom = classroomRepository.findById(classId)
                .orElseThrow(() -> new CustomException(ClassRoomStatus.CLASS_NOT_FOUND));

        // 학생 일괄 배정
        List<ClassParticipant> newParticipants = new ArrayList<>();

        for (Long studentId : request.getStudentIds()) {
            // 학생 조회
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new CustomException(AdminStatus.USER_NOT_FOUND));

            // 학생 권한 확인
            if (!student.getRole().equals(UserRole.STUDENT)) {
                throw new CustomException(AdminStatus.FORBIDDEN);
            }

            // 이미 배정된 학생인지 확인
            boolean alreadyAssigned = classParticipantRepository
                    .findByClassRoom_ClassIdAndUser_UserId(classId, studentId)
                    .isPresent();

            if (!alreadyAssigned) {
                // 새로운 참여자 생성
                ClassParticipant participant = ClassParticipant.builder()
                        .user(student)
                        .classRoom(classRoom)
                        .build();
                newParticipants.add(participant);
            }
        }

        // 일괄 저장
        if (!newParticipants.isEmpty()) {
            classParticipantRepository.saveAll(newParticipants);
        }
    }
}