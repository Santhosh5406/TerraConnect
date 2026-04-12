package com.farm.management.service;

import com.farm.management.dto.CropInfoDto;
import com.farm.management.model.CropInfo;
import com.farm.management.repository.CropInfoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class CropService {

    private final CropInfoRepository cropInfoRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private JsonNode translationsNode;

    public CropService(CropInfoRepository cropInfoRepository) {
        this.cropInfoRepository = cropInfoRepository;
        try {
            ClassPathResource resource = new ClassPathResource("translations.json");
            translationsNode = objectMapper.readTree(resource.getInputStream());
        } catch (Exception e) {
            System.err.println("Failed to load translations.json: " + e.getMessage());
        }
    }

    public CropInfoDto getCropInfoByName(String cropName, String lang) {
        CropInfo cropInfo = cropInfoRepository.findByCropName(cropName).orElse(null);
        if (cropInfo == null) {
            cropInfo = new CropInfo();
            cropInfo.setCropName(cropName);
            cropInfo.setBestPractices("Typical farming practices. Ensure adequate water and sunlight. Avoid over-fertilization depending on soil tests.");
            cropInfo.setPotentialDiseases("Common pests and local fungal infections.");
        }
        return convertToDto(cropInfo, lang);
    }

    private CropInfoDto convertToDto(CropInfo cropInfo, String lang) {
        CropInfoDto dto = new CropInfoDto();
        dto.setCropName(cropInfo.getCropName());
        dto.setBestPractices(cropInfo.getBestPractices());
        dto.setPotentialDiseases(cropInfo.getPotentialDiseases());
        
        String name = cropInfo.getCropName().toLowerCase();
        
        // Base hardcoded settings (fallback)
        dto.setFertilizerRecommendation("Balanced NPK Fertilizer (10-10-10) baseline.");
        dto.setPesticideRecommendation("Organic Neem Oil or standard Pyrethrins.");
        dto.setCommonPests("Aphids, Whiteflies.");
        dto.setGeneralInfo("A standard crop entry.");

        if (name.contains("wheat")) {
            dto.setCompanionPlants("Legumes, Mustard, Linseed");
            dto.setOptimalPhLevel("6.0 to 7.0 (Well-drained Alluvial)");
            dto.setAverageGrowthCycle("110 - 130 Days");
        } else if (name.contains("corn")) {
            dto.setCompanionPlants("Beans, Squash, Sunflowers, Amaranth");
            dto.setOptimalPhLevel("5.8 to 7.0 (Deep Red/Alluvial)");
            dto.setAverageGrowthCycle("60 - 100 Days");
        } else if (name.contains("rice")) {
            dto.setCompanionPlants("Azolla, Beans (on bunds)");
            dto.setOptimalPhLevel("5.5 to 6.5 (Clay-Loam)");
            dto.setAverageGrowthCycle("120 - 150 Days");
        } else if (name.contains("soybean")) {
            dto.setCompanionPlants("Corn, Wheat");
            dto.setOptimalPhLevel("6.0 to 6.8");
            dto.setAverageGrowthCycle("90 - 120 Days");
        } else if (name.contains("sugarcane")) {
            dto.setCompanionPlants("Cowpea, Mung bean");
            dto.setOptimalPhLevel("6.5 to 7.5 (Alluvial/Black)");
            dto.setAverageGrowthCycle("300 - 365 Days");
        } else if (name.contains("cotton")) {
            dto.setCompanionPlants("Cowpea, Groundnut, Pigeon pea");
            dto.setOptimalPhLevel("5.8 to 8.0 (Black/Regur soil)");
            dto.setAverageGrowthCycle("150 - 180 Days");
        } else if (name.contains("bajra") || name.contains("pearl millet")) {
            dto.setCompanionPlants("Cluster bean, Cowpea, Green gram");
            dto.setOptimalPhLevel("6.0 to 8.0 (Sandy/Laterite)");
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
        } else if (name.contains("turmeric") || name.contains("mango") || name.contains("banana") || name.contains("black pepper")) {
            dto.setCompanionPlants("Legumes, Shade Trees");
            dto.setOptimalPhLevel("5.5 to 7.5");
            dto.setAverageGrowthCycle("Varies (perennial or 200+ days)");
        } else {
            dto.setCompanionPlants("General Cover Crops (clover, alfalfa)");
            dto.setOptimalPhLevel("6.0 to 7.0");
            dto.setAverageGrowthCycle("Varies (approx 90-120 days)");
        }
        
        // Apply JSON hardcoded translations unconditionally replacing fields if mapped
        if (translationsNode != null) {
            String sanitizedLang = (lang != null && !lang.isEmpty()) ? lang.toLowerCase() : "en";
            JsonNode langNode = translationsNode.get(sanitizedLang);
            if (langNode != null) {
                // Find matching crop key
                String targetKey = null;
                if (name.contains("corn")) targetKey = "corn";
                else if (name.contains("rice")) targetKey = "rice";
                else if (name.contains("wheat")) targetKey = "wheat";
                else if (name.contains("soybean")) targetKey = "soybean";
                else if (name.contains("sugarcane")) targetKey = "sugarcane";
                else if (name.contains("cotton")) targetKey = "cotton";
                else if (name.contains("onion")) targetKey = "onion";
                else if (name.contains("tomato")) targetKey = "tomato";
                else if (name.contains("potato")) targetKey = "potato";
                else if (name.contains("banana")) targetKey = "banana";
                else if (name.contains("bajra") || name.contains("millet")) targetKey = "millet";
                else if (name.contains("groundnut") || name.contains("peanut")) targetKey = "groundnut";
                
                if (targetKey != null && langNode.has(targetKey)) {
                    JsonNode cNode = langNode.get(targetKey);
                    if (cNode.has("cropName")) dto.setCropName(cNode.get("cropName").asText());
                    if (cNode.has("bestPractices")) dto.setBestPractices(cNode.get("bestPractices").asText());
                    if (cNode.has("potentialDiseases")) dto.setPotentialDiseases(cNode.get("potentialDiseases").asText());
                    if (cNode.has("companionPlants")) dto.setCompanionPlants(cNode.get("companionPlants").asText());
                    if (cNode.has("optimalPhLevel")) dto.setOptimalPhLevel(cNode.get("optimalPhLevel").asText());
                    if (cNode.has("averageGrowthCycle")) dto.setAverageGrowthCycle(cNode.get("averageGrowthCycle").asText());
                    if (cNode.has("fertilizerRecommendation")) dto.setFertilizerRecommendation(cNode.get("fertilizerRecommendation").asText());
                    if (cNode.has("pesticideRecommendation")) dto.setPesticideRecommendation(cNode.get("pesticideRecommendation").asText());
                    if (cNode.has("commonPests")) dto.setCommonPests(cNode.get("commonPests").asText());
                    if (cNode.has("generalInfo")) dto.setGeneralInfo(cNode.get("generalInfo").asText());
                }
            }
        }
        return dto;
    }
}