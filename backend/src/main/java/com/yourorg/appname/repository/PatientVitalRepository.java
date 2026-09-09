package com.yourorg.appname.repository;

import com.yourorg.appname.entity.PatientVital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientVitalRepository extends JpaRepository<PatientVital, Long> {
    List<PatientVital> findByPatientIdOrderByRecordedAtDesc(Long patientId);
}
