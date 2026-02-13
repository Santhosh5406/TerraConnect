package com.farm.management.repository;

import com.farm.management.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FarmRepository extends JpaRepository<Farm, Long> {
    Optional<Farm> findByUserId(Long userId);
}
