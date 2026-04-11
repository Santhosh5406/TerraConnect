package com.farm.management.service;

import com.farm.management.dto.FarmDto;
import com.farm.management.dto.FarmCropDto;
import com.farm.management.model.Farm;
import com.farm.management.model.FarmCrop;
import com.farm.management.model.User;
import com.farm.management.repository.FarmRepository;
import com.farm.management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

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
        
        farm.getCrops().clear();
        if (farmDto.getCrops() != null) {
            farm.getCrops().addAll(farmDto.getCrops().stream().map(dto -> {
                FarmCrop fc = new FarmCrop();
                fc.setCropName(dto.getCropName());
                fc.setAcresAllocated(dto.getAcresAllocated());
                fc.setExpectedYield(dto.getExpectedYield());
                return fc;
            }).collect(Collectors.toList()));
        }

        Farm updatedFarm = farmRepository.save(farm);
        return convertToDto(updatedFarm);
    }

    private FarmDto convertToDto(Farm farm) {
        FarmDto dto = new FarmDto();
        dto.setAcres(farm.getAcres());
        dto.setSoilType(farm.getSoilType());
        dto.setLocation(farm.getLocation());
        
        if (farm.getCrops() != null) {
            dto.setCrops(farm.getCrops().stream().map(fc -> {
                FarmCropDto fdto = new FarmCropDto();
                fdto.setCropName(fc.getCropName());
                fdto.setAcresAllocated(fc.getAcresAllocated());
                fdto.setExpectedYield(fc.getExpectedYield());
                return fdto;
            }).collect(Collectors.toList()));
        }
        
        // Software-based Business Logic (Aggregate over crops)
        dto.setSustainabilityScore(calculateSustainabilityScore(farm));
        dto.setWaterRequirementLiters(calculateWaterRequirements(farm));
        dto.setRecommendedNextCrop(calculateNextCrop(farm));
        dto.setSoilHealthStatus(calculateSoilHealth(farm));
        
        return dto;
    }

    private int calculateSustainabilityScore(Farm farm) {
        if (farm.getCrops() == null || farm.getCrops().isEmpty() || farm.getAcres() <= 0) {
            return 50;
        }

        double totalWeightedScore = 0;
        double totalAcres = 0;
        
        for (FarmCrop fc : farm.getCrops()) {
            int score = 50; // base score for this zone
            String crop = fc.getCropName() != null ? fc.getCropName().toLowerCase() : "";
            String soil = farm.getSoilType() != null ? farm.getSoilType().toLowerCase() : "";
            
            if (crop.contains("legume") || crop.contains("beans") || crop.contains("peas") || crop.contains("alfalfa") || crop.contains("soy") || crop.contains("groundnut") || crop.contains("chickpea")) {
                score += 30;
            } else if (crop.contains("corn") || crop.contains("cotton") || crop.contains("sugarcane")) {
                score -= 10;
            }
            
            if (soil.contains("loam") || soil.contains("alluvial")) {
                score += 20;
            } else if (soil.contains("clay") || soil.contains("black") || soil.contains("regur")) {
                score += 10;
            }
            
            totalWeightedScore += score * fc.getAcresAllocated();
            totalAcres += fc.getAcresAllocated();
        }
        
        if (totalAcres == 0) return 50;
        return (int) Math.min(100, Math.max(0, totalWeightedScore / totalAcres));
    }

    private double calculateWaterRequirements(Farm farm) {
        if (farm.getCrops() == null || farm.getCrops().isEmpty()) return 0;

        double baseRatePerAcre = 404600.0;
        double totalWater = 0;
        
        for (FarmCrop fc : farm.getCrops()) {
            String crop = fc.getCropName() != null ? fc.getCropName().toLowerCase() : "";
            double multiplier = 1.0;
            if (crop.contains("rice") || crop.contains("sugarcane") || crop.contains("cotton")) {
                multiplier = 2.0; 
            } else if (crop.contains("wheat") || crop.contains("corn") || crop.contains("onion") || crop.contains("tomato")) {
                multiplier = 1.2;
            } else if (crop.contains("millet") || crop.contains("bajra") || crop.contains("sorghum")) {
                multiplier = 0.5; 
            }
            totalWater += fc.getAcresAllocated() * baseRatePerAcre * multiplier;
        }
        
        return totalWater;
    }

    private String calculateNextCrop(Farm farm) {
        if (farm.getCrops() == null || farm.getCrops().isEmpty()) return "Legumes or Cover Crop";
        
        // Find majority crop to base recommendation on
        FarmCrop primary = farm.getCrops().stream().max((c1, c2) -> Double.compare(c1.getAcresAllocated(), c2.getAcresAllocated())).orElse(null);
        if (primary == null || primary.getCropName() == null) return "Cover Crop (e.g., Clover, Ryegrass)";
        
        String crop = primary.getCropName().toLowerCase();
        
        if (crop.contains("corn") || crop.contains("wheat") || crop.contains("rice") || crop.contains("sugarcane") || crop.contains("cotton")) {
            return "Legumes (e.g., Soybeans, Chickpea, Moong)"; 
        } else if (crop.contains("legume") || crop.contains("beans") || crop.contains("peas") || crop.contains("soy") || crop.contains("groundnut")) {
            return "Leafy Greens or Roots (e.g., Spinach, Onions)";
        } else if (crop.contains("tomato") || crop.contains("potato") || crop.contains("onion")) {
            return "Corn or Wheat"; 
        }
        
        return "Cover Crop (e.g., Clover, Sunhemp)";
    }

    private String calculateSoilHealth(Farm farm) {
        if (farm.getSoilType() == null) return "Unknown";
        String soil = farm.getSoilType().toLowerCase();
        
        if (soil.contains("loam") || soil.contains("alluvial")) {
            return "Excellent - High nutrient retention";
        } else if (soil.contains("sandy") || soil.contains("laterite")) {
            return "Poor - Requires frequent irrigation & organic matter";
        } else if (soil.contains("clay") || soil.contains("black") || soil.contains("regur")) {
            return "Fair - Good nutrients but monitor drainage";
        }
        return "Moderate - Monitor closely based on yield";
    }
}
