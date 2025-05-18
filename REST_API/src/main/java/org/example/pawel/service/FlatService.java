package org.example.pawel.service;

import lombok.AllArgsConstructor;
import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.Flat;
import org.example.pawel.mapper.FlatDTOMapper;
import org.example.pawel.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FlatService {

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private FlatDTOMapper flatDTOMapper;

    public List<FlatDTO> getAllFlats() {
        return flatRepository.findAll().stream()
                .map(flat -> flatDTOMapper.mapToDTO(flat))
                .toList();
    }

    public List<FlatDTO> searchFlats(String city, Integer rooms, Double minPrice, Double maxPrice,
                                     Boolean isAvailable, Double minArea, Double maxArea) {
        return flatRepository.findAll().stream()
                .filter(flat -> city == null || flat.getCity().equalsIgnoreCase(city))
                .filter(flat -> rooms == null || flat.getRooms().equals(rooms))
                .filter(flat -> minPrice == null || flat.getPrice() >= minPrice)
                .filter(flat -> maxPrice == null || flat.getPrice() <= maxPrice)
                .filter(flat -> isAvailable == null || flat.getIsAvailable().equals(isAvailable))
                .filter(flat -> minArea == null || flat.getArea() >= minArea)
                .filter(flat -> maxArea == null || flat.getArea() <= maxArea)
                .map(flat -> flatDTOMapper.mapToDTO(flat))
                .collect(Collectors.toList());
    }

    public FlatDTO addFlat(FlatDTO flatDTO) {
        Flat flat = flatDTOMapper.mapToEntity(flatDTO);
        Flat saved = flatRepository.save(flat);
        return flatDTOMapper.mapToDTO(saved);
    }

    public void deleteFlat(Long id) {
        flatRepository.deleteById(id);
    }

    public FlatDTO updateFlat(Long id, FlatDTO flatDTO) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flat not found with id " + id));

        flat.setName(flatDTO.getName());
        flat.setDescription(flatDTO.getDescription());
        flat.setCity(flatDTO.getCity());
        flat.setDistrict(flatDTO.getDistrict());
        flat.setStreet(flatDTO.getStreet());
        flat.setBuildingNumber(flatDTO.getBuildingNumber());
        flat.setFlatNumber(flatDTO.getFlatNumber());
        flat.setPostalCode(flatDTO.getPostalCode());
        flat.setRooms(flatDTO.getRooms());
        flat.setArea(flatDTO.getArea());
        flat.setPrice(flatDTO.getPrice());
        flat.setIsAvailable(flatDTO.getIsAvailable());

        Flat updated = flatRepository.save(flat);
        return flatDTOMapper.mapToDTO(updated);
    }

}
