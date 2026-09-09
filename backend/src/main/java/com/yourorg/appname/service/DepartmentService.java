package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.DepartmentDTO;

import java.util.List;

public interface DepartmentService {
    List<DepartmentDTO> getAllDepartments();
    DepartmentDTO getDepartmentById(Long id);
    DepartmentDTO getDepartmentByCode(String code);
}
