package com.farm.management.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmCrop {
    private String cropName;
    private double acresAllocated;
    
    // Server-calculated yield mapping based on acres
    private double expectedYield;
}
