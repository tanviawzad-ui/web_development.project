package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdAndIsActiveTrue(Long patientId);
    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);
}
