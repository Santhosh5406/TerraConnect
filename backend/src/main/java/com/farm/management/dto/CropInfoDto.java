package com.farm.management.dto;

import lombok.Data;

@Data
public class CropInfoDto {
    private String cropName;
    private String bestPractices;
    private String potentialDiseases;
    
    // New Crop Intelligence fields
    private String companionPlants;
    private String optimalPhLevel;
    private String averageGrowthCycle;
    private String fertilizerRecommendation;
    private String pesticideRecommendation;
    private String commonPests;
    private String generalInfo;
}
