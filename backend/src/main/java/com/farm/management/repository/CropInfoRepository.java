package com.farm.management.repository;

import com.farm.management.model.CropInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CropInfoRepository extends JpaRepository<CropInfo, Long> {
    Optional<CropInfo> findByCropName(String cropName);
}
