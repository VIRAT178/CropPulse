package com.croppulse.backend.Repos;

import com.croppulse.backend.Model.Farmer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FarmerRepo extends MongoRepository<Farmer , Long> {

    Page<Farmer> findAll(Pageable pageable);
    List<Farmer> findByState(String state);
    List<Farmer> findByVillage(String village);
    Optional<Farmer> findByEmail(String email);

}
