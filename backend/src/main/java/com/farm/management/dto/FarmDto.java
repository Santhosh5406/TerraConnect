package com.farm.management.dto;

import lombok.Data;

@Data
public class FarmDto {
    private double acres;
    private String soilType;
    private String location;
    private java.util.List<FarmCropDto> crops = new java.util.ArrayList<>();
    
    // New Business Logic Variables
    private int sustainabilityScore;
    private double waterRequirementLiters;
    private String recommendedNextCrop;
    private String soilHealthStatus;
}