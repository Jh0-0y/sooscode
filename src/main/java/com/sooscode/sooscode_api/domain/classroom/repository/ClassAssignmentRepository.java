package com.sooscode.sooscode_api.domain.classroom.repository;

import com.sooscode.sooscode_api.domain.classroom.entity.ClassAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClassAssignmentRepository extends JpaRepository<ClassAssignment, Long> {

}