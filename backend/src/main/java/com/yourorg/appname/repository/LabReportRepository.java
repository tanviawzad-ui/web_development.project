package com.yourorg.appname.repository;

import com.yourorg.appname.entity.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByPatientIdOrderByTestDateDesc(Long patientId);
    List<LabReport> findByPatientUhidOrderByTestDateDesc(String uhid);
    Optional<LabReport> findByReportNumber(String reportNumber);
}
