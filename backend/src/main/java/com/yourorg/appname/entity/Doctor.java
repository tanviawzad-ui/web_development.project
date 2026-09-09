package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 200)
    private String qualifications;

    @Column(nullable = false, length = 100)
    private String speciality;

    @Column(name = "experience_years", nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    @Column(name = "consultation_fee", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal consultationFee = BigDecimal.valueOf(1000.00);

    @Column(name = "languages_spoken", length = 200)
    @Builder.Default
    private String languagesSpoken = "English, Hindi";

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(4.9);

    @Column(name = "reviews_count")
    @Builder.Default
    private Integer reviewsCount = 100;

    @Column(name = "opd_room", length = 100)
    @Builder.Default
    private String opdRoom = "Block B, 2nd Floor, Room 204";

    @Column(name = "opd_timings", length = 100)
    @Builder.Default
    private String opdTimings = "Mon - Sat (09:00 AM - 08:00 PM)";

    @Column(length = 20)
    @Builder.Default
    private String gender = "Male";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_available_today")
    @Builder.Default
    private Boolean isAvailableToday = true;

    @Column(name = "next_available_slot", length = 50)
    @Builder.Default
    private String nextAvailableSlot = "Today, 04:30 PM";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
