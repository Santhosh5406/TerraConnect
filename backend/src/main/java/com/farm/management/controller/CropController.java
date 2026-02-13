package com.farm.management.controller;

import com.farm.management.dto.CropInfoDto;
import com.farm.management.service.CropService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crop")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping("/{cropName}")
    public ResponseEntity<CropInfoDto> getCropInfo(@PathVariable String cropName) {
        CropInfoDto cropInfo = cropService.getCropInfoByName(cropName);
        return ResponseEntity.ok(cropInfo);
    }
}
