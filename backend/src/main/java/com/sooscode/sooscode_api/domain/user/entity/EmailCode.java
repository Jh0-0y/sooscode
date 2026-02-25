package com.sooscode.sooscode_api.domain.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_code")
@Getter
@Setter
public class EmailCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailCodeId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private Boolean isVerified;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, name="expiration")
    private LocalDateTime expiredAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
