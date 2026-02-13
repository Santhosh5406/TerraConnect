package com.farm.management.controller;

import com.farm.management.dto.FarmDto;
import com.farm.management.service.FarmService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farm")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @GetMapping
    public ResponseEntity<FarmDto> getFarmDetails(Authentication authentication) {
        String username = authentication.getName();
        FarmDto farmDto = farmService.getFarmDetailsByUsername(username);
        return ResponseEntity.ok(farmDto);
    }

    @PutMapping
    public ResponseEntity<FarmDto> updateFarmDetails(Authentication authentication, @RequestBody FarmDto farmDto) {
        String username = authentication.getName();
        FarmDto updatedFarm = farmService.updateFarmDetails(username, farmDto);
        return ResponseEntity.ok(updatedFarm);
    }
}
