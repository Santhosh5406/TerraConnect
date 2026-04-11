package com.farm.management.service;

import com.farm.management.dto.FarmDto;
import com.farm.management.model.Farm;
import com.farm.management.model.User;
import com.farm.management.repository.FarmRepository;
import com.farm.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public FarmService(FarmRepository farmRepository, UserRepository userRepository) {
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    public FarmDto getFarmDetailsByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Farm farm = farmRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Farm not found for user"));
        return convertToDto(farm);
    }

    @Transactional
    public FarmDto updateFarmDetails(String username, FarmDto farmDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Farm farm = farmRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Farm not found for user"));

        farm.setAcres(farmDto.getAcres());
        farm.setSoilType(farmDto.getSoilType());
        farm.setLocation(farmDto.getLocation());
        farm.setCurrentCrop(farmDto.getCurrentCrop());
        farm.setExpectedYield(farmDto.getExpectedYield());

        Farm updatedFarm = farmRepository.save(farm);
        return convertToDto(updatedFarm);
    }

    private FarmDto convertToDto(Farm farm) {
        FarmDto dto = new FarmDto();
        dto.setAcres(farm.getAcres());
        dto.setSoilType(farm.getSoilType());
        dto.setLocation(farm.getLocation());
        dto.setCurrentCrop(farm.getCurrentCrop());
        dto.setExpectedYield(farm.getExpectedYield());
        
        // Software-based Business Logic
        dto.setSustainabilityScore(calculateSustainabilityScore(farm));
        dto.setWaterRequirementLiters(calculateWaterRequirements(farm));
        dto.setRecommendedNextCrop(calculateNextCrop(farm.getCurrentCrop()));
        dto.setSoilHealthStatus(calculateSoilHealth(farm.getSoilType(), farm.getCurrentCrop()));
        
        return dto;
    }

    private int calculateSustainabilityScore(Farm farm) {
        int score = 50; // base score
        String crop = farm.getCurrentCrop() != null ? farm.getCurrentCrop().toLowerCase() : "";
        String soil = farm.getSoilType() != null ? farm.getSoilType().toLowerCase() : "";
        
        // Add points for sustainable crops
        if (crop.contains("legume") || crop.contains("beans") || crop.contains("peas") || crop.contains("alfalfa")) {
            score += 30;
        } else if (crop.contains("corn") || crop.contains("cotton")) {
            score -= 10;
        }
        
        // Add points for compatible soil
        if (soil.contains("loam")) {
            score += 20;
        } else if (soil.contains("clay")) {
            score += 10;
        }
        
        return Math.min(100, Math.max(0, score));
    }

    private double calculateWaterRequirements(Farm farm) {
        // Base: 1 acre = ~4046 sq meters. Assume base 100 liters per sqm per season = 404,600 liters/acre
        double baseRatePerAcre = 404600.0;
        String crop = farm.getCurrentCrop() != null ? farm.getCurrentCrop().toLowerCase() : "";
        
        double multiplier = 1.0;
        if (crop.contains("rice") || crop.contains("sugarcane")) {
            multiplier = 2.0; // High water intensity
        } else if (crop.contains("wheat") || crop.contains("corn")) {
            multiplier = 1.2;
        } else if (crop.contains("millet") || crop.contains("sorghum") || crop.contains("cactus")) {
            multiplier = 0.5; // Drought resistant
        }
        
        return farm.getAcres() * baseRatePerAcre * multiplier;
    }

    private String calculateNextCrop(String currentCrop) {
        if (currentCrop == null) return "Legumes or Cover Crop";
        String crop = currentCrop.toLowerCase();
        
        if (crop.contains("corn") || crop.contains("wheat") || crop.contains("rice")) {
            return "Legumes (e.g., Soybeans, Peas)"; // Nitrogen fixing
        } else if (crop.contains("legume") || crop.contains("beans") || crop.contains("peas") || crop.contains("soy")) {
            return "Leafy Greens or Roots (e.g., Spinach, Carrots)";
        } else if (crop.contains("tomato") || crop.contains("potato")) {
            return "Corn or Wheat"; // Break disease cycles
        }
        
        return "Cover Crop (e.g., Clover, Ryegrass)";
    }

    private String calculateSoilHealth(String soilType, String currentCrop) {
        if (soilType == null) return "Unknown";
        String soil = soilType.toLowerCase();
        
        if (soil.contains("loam")) {
            return "Excellent - High nutrient retention";
        } else if (soil.contains("sandy")) {
            return "Poor - Requires frequent irrigation & organic matter";
        } else if (soil.contains("clay")) {
            return "Fair - Good nutrients but poor drainage";
        }
        return "Moderate - Monitor closely based on yield";
    }
}
