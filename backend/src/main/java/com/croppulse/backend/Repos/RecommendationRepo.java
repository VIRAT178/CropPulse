package com.croppulse.backend.Repos;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.croppulse.backend.Model.Recommendation;

import java.util.List;

public interface RecommendationRepo extends MongoRepository<Recommendation, Long> {

    List<Recommendation> findByFarmerId(Long farmerId);
}
