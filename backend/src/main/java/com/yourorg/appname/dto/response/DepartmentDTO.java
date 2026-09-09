package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private Long id;
    private String name;
    private String code;
    private String icon;
    private String description;
    private String subSpecialties;
    private List<String> tags;
    private Integer totalDoctors;
    private String opdClinicHours;
    private Boolean isEmergencyActive;
}
