package com.manutencao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryEntry {

    @Column(nullable = false)
    private String date;

    @Enumerated(EnumType.STRING)
    private RequestStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus toStatus;

    private Long employeeId;

    @Column(length = 150)
    private String employeeName;

    @Column(columnDefinition = "TEXT")
    private String note;
}