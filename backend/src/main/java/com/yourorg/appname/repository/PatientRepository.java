package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUhid(String uhid);
    Optional<Patient> findByUserId(Long userId);
    Optional<Patient> findByMobileNumber(String mobileNumber);
    Optional<Patient> findByEmail(String email);
}
