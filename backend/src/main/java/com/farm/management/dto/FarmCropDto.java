package com.farm.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmCropDto {
    private String cropName;
    private double acresAllocated;
    private double expectedYield;
}
