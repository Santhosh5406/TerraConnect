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
        CropInfo cropInfo = cropInfoRepository.findByCropName(cropName)
                .orElseThrow(() -> new RuntimeException("Information for crop '" + cropName + "' not found."));
        return convertToDto(cropInfo);
    }

    private CropInfoDto convertToDto(CropInfo cropInfo) {
        CropInfoDto dto = new CropInfoDto();
        dto.setCropName(cropInfo.getCropName());
        dto.setBestPractices(cropInfo.getBestPractices());
        dto.setPotentialDiseases(cropInfo.getPotentialDiseases());
        return dto;
    }
}