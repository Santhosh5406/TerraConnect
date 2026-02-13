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
        return dto;
    }
}
