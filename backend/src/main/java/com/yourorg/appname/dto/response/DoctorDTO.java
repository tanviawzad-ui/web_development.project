package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long id;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private String name;
    private String title;
    private String qualifications;
    private String speciality;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String languagesSpoken;
    private List<String> languagesList;
    private BigDecimal rating;
    private Integer reviewsCount;
    private String opdRoom;
    private String opdTimings;
    private String gender;
    private String imageUrl;
    private Boolean isAvailableToday;
    private String nextAvailableSlot;
}
