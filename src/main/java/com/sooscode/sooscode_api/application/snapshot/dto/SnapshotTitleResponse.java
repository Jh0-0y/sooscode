package com.sooscode.sooscode_api.application.snapshot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SnapshotTitleResponse {
    private Long codeSnapshotId;
    private String title;
    private SnapshotLanguage language;
    private LocalDateTime createdAt;
}
