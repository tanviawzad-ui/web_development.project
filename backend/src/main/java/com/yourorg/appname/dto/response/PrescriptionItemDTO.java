package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItemDTO {
    private Long id;
    private String medicineName;
    private String category;
    private String dosage;
    private String timingInstructions;
    private String timingBadge;
    private Integer durationDays;
    private Integer daysLeft;
}
