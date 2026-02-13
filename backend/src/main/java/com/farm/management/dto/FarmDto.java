package com.farm.management.dto;

import lombok.Data;

@Data
public class FarmDto {
    private double acres;
    private String soilType;
    private String location;
    private String currentCrop;
    private double expectedYield;
}