package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDTO {
    private Long id;
    private String prescriptionNumber;
    private Long patientId;
    private String patientName;
    private String patientUhid;
    private Long doctorId;
    private String doctorName;
    private String doctorSpeciality;
    private LocalDate issuedDate;
    private LocalDate nextReviewDate;
    private String lifestyleInstructions;
    private Boolean isActive;
    private List<PrescriptionItemDTO> items;
}
