package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.DoctorDTO;

import java.util.List;

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    DoctorDTO getDoctorById(Long id);
    List<DoctorDTO> getFeaturedDoctors();
    List<DoctorDTO> filterDoctors(String search, String departmentCode, String speciality, String gender, Integer minExperience, Boolean availableToday);
    List<DoctorDTO> getDoctorsByDepartment(Long departmentId);
}
