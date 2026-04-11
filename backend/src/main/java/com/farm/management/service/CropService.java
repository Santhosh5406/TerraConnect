package com.farm.management.service;

import com.farm.management.dto.CropInfoDto;
import com.farm.management.model.CropInfo;
import com.farm.management.repository.CropInfoRepository;
import org.springframework.stereotype.Service;

@Service
public class CropService {

    private final CropInfoRepository cropInfoRepository;

    public CropService(CropInfoRepository cropInfoRepository) {
        this.cropInfoRepository = cropInfoRepository;
    }

    public CropInfoDto getCropInfoByName(String cropName) {
        CropInfo cropInfo = cropInfoRepository.findByCropName(cropName).orElse(null);
        if (cropInfo == null) {
            // Software based default generation instead of DB crash
            cropInfo = new CropInfo();
            cropInfo.setCropName(cropName);
            cropInfo.setBestPractices("Typical farming practices. Ensure adequate water and sunlight. Avoid over-fertilization depending on soil tests.");
            cropInfo.setPotentialDiseases("Common pests and local fungal infections.");
        }
        return convertToDto(cropInfo);
    }

    private CropInfoDto convertToDto(CropInfo cropInfo) {
        CropInfoDto dto = new CropInfoDto();
        dto.setCropName(cropInfo.getCropName());
        dto.setBestPractices(cropInfo.getBestPractices());
        dto.setPotentialDiseases(cropInfo.getPotentialDiseases());
        
        // Software-based derived intelligence
        String name = cropInfo.getCropName() != null ? cropInfo.getCropName().toLowerCase() : "";
        if (name.contains("rice") || name.contains("paddy")) {
            dto.setCompanionPlants("Azolla, Soybeans, Beans");
            dto.setOptimalPhLevel("5.5 to 6.5 (Alluvial/Clay-Loam)");
            dto.setAverageGrowthCycle("90 - 150 Days");
        } else if (name.contains("wheat")) {
            dto.setCompanionPlants("Mustard, Clover, Vetch");
            dto.setOptimalPhLevel("6.0 to 7.0 (Alluvial)");
            dto.setAverageGrowthCycle("110 - 130 Days");
        } else if (name.contains("corn") || name.contains("maize")) {
            dto.setCompanionPlants("Beans, Squash, Sunflowers, Peas");
            dto.setOptimalPhLevel("5.8 to 7.0 (Red/Alluvial)");
            dto.setAverageGrowthCycle("60 - 100 Days");
        } else if (name.contains("legume") || name.contains("soy") || name.contains("chickpea") || name.contains("chana")) {
            dto.setCompanionPlants("Corn, Strawberries, Cucumbers");
            dto.setOptimalPhLevel("6.0 to 6.8 (Black/Red Soil)");
            dto.setAverageGrowthCycle("80 - 120 Days");
        } else if (name.contains("sugarcane")) {
            dto.setCompanionPlants("Onion, Garlic, Coriander");
            dto.setOptimalPhLevel("6.5 to 7.5 (Deep Alluvial/Black)");
            dto.setAverageGrowthCycle("12 - 18 Months");
        } else if (name.contains("cotton")) {
            dto.setCompanionPlants("Cowpea, Marigold, Sunhemp");
            dto.setOptimalPhLevel("5.8 to 8.0 (Black Soil/Regur)");
            dto.setAverageGrowthCycle("150 - 180 Days");
        } else if (name.contains("millet") || name.contains("bajra") || name.contains("jowar")) {
            dto.setCompanionPlants("Pigeon Pea (Tur), Moong, Cowpea");
            dto.setOptimalPhLevel("5.5 to 7.5 (Sandy/Laterite)");
            dto.setAverageGrowthCycle("70 - 90 Days");
        } else if (name.contains("groundnut") || name.contains("peanut")) {
            dto.setCompanionPlants("Maize, Sorghum, Pearl Millet");
            dto.setOptimalPhLevel("6.0 to 6.5 (Sandy Loam/Red)");
            dto.setAverageGrowthCycle("90 - 120 Days");
        } else if (name.contains("onion")) {
            dto.setCompanionPlants("Carrots, Lettuce, Chamomile");
            dto.setOptimalPhLevel("6.0 to 7.0 (Loose, well-draining)");
            dto.setAverageGrowthCycle("90 - 150 Days");
        } else if (name.contains("tomato")) {
            dto.setCompanionPlants("Basil, Marigold, Garlic");
            dto.setOptimalPhLevel("6.0 to 6.8 (Loamy/Sandy Loam)");
            dto.setAverageGrowthCycle("60 - 100 Days");
        } else {
            dto.setCompanionPlants("General Cover Crops (clover, alfalfa)");
            dto.setOptimalPhLevel("6.0 to 7.0");
            dto.setAverageGrowthCycle("Varies (approx 90-120 days)");
        }
        
        return dto;
    }
}