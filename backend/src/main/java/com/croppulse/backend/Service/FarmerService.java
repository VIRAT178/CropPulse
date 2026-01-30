package com.croppulse.backend.Service;

import com.croppulse.backend.Model.Farmer;
import com.croppulse.backend.Repos.FarmerRepo;
import com.croppulse.backend.dto.FarmerDTO;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class FarmerService {
    private final FarmerRepo farmerRepo;
    public FarmerService(FarmerRepo farmerRepo) {
        this.farmerRepo = farmerRepo;
    }

    public List<Farmer> getAllFarmers(){
        return farmerRepo.findAll();
    }

    public Farmer getFarmerById(Long id){
        return farmerRepo.findById(id)
                .orElseThrow(()-> new RuntimeException("Farmer not found by this "+ id));
    }

    public Farmer saveFarmer(Farmer farmer){
        return farmerRepo.save(farmer);
    }

    public void deleteFarmer(Long id){
        Farmer farmer = getFarmerById(id);
        farmerRepo.delete(farmer);
    }

    public Farmer updateFarmer(Long id, Farmer farmerData) {
        Farmer farmer = getFarmerById(id);
        farmer.setName(farmerData.getName());
        farmer.setVillage(farmerData.getVillage());
        farmer.setState(farmerData.getState());
        farmer.setLandSize(farmerData.getLandSize());
        farmer.setSoilType(farmerData.getSoilType());
        return farmerRepo.save(farmer);
    }
}
