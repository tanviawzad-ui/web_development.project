package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByDepartmentId(Long departmentId);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.speciality) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.department.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:departmentCode IS NULL OR LOWER(d.department.code) = LOWER(:departmentCode)) AND " +
           "(:speciality IS NULL OR LOWER(d.speciality) LIKE LOWER(CONCAT('%', :speciality, '%'))) AND " +
           "(:gender IS NULL OR LOWER(d.gender) = LOWER(:gender)) AND " +
           "(:minExperience IS NULL OR d.experienceYears >= :minExperience) AND " +
           "(:availableToday IS NULL OR d.isAvailableToday = :availableToday)")
    List<Doctor> searchAndFilter(
            @Param("search") String search,
            @Param("departmentCode") String departmentCode,
            @Param("speciality") String speciality,
            @Param("gender") String gender,
            @Param("minExperience") Integer minExperience,
            @Param("availableToday") Boolean availableToday
    );
}
