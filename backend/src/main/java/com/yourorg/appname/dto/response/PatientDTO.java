package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    private Long userId;
    private String uhid;
    private String abhaId;
    private String fullName;
    private String email;
    private String mobileNumber;
    private LocalDate dateOfBirth;
    private Integer ageYears;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private Boolean isCashlessPreapproved;
    private Long primaryDoctorId;
    private String primaryDoctorName;
    private String primaryDoctorSpeciality;
}
