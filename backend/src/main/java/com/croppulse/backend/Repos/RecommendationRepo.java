package com.croppulse.backend.Repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.croppulse.backend.Model.Recommendation;

import java.util.List;

public interface RecommendationRepo extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByFarmerId(Long farmerId);
}
