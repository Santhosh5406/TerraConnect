package com.farm.management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CropInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String cropName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bestPractices;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String potentialDiseases;
}
