package com.farm.management.dto;

import lombok.Data;

@Data
public class FarmDto {
    private double acres;
    private String soilType;
    private String location;
    private String currentCrop;
    private double expectedYield;
    
    // New Business Logic Variables
    private int sustainabilityScore;
    private double waterRequirementLiters;
    private String recommendedNextCrop;
    private String soilHealthStatus;
}