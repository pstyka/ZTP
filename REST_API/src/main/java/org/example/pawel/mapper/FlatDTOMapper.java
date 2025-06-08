package org.example.pawel.mapper;

import lombok.RequiredArgsConstructor;
import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.repository.FlatPhotoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FlatDTOMapper {

    private final FlatPhotoRepository flatPhotoRepository;

    public FlatDTO mapToDTO(Flat flat) {
        return FlatDTO.builder()
                .id(flat.getId())
                .name(flat.getName())
                .description(flat.getDescription())
                .city(flat.getCity())
                .district(flat.getDistrict())
                .street(flat.getStreet())
                .buildingNumber(flat.getBuildingNumber())
                .flatNumber(flat.getFlatNumber())
                .postalCode(flat.getPostalCode())
                .rooms(flat.getRooms())
                .area(flat.getArea())
                .price(flat.getPrice())
                .isAvailable(flat.getIsAvailable())
                .visitCount(flat.getVisitCount())
                .createdAt(flat.getCreatedAt())
                .updatedAt(flat.getUpdatedAt())
                .build();
    }

    public Flat mapToEntity(FlatDTO dto) {
        return Flat.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .city(dto.getCity())
                .district(dto.getDistrict())
                .street(dto.getStreet())
                .buildingNumber(dto.getBuildingNumber())
                .flatNumber(dto.getFlatNumber())
                .postalCode(dto.getPostalCode())
                .rooms(dto.getRooms())
                .area(dto.getArea())
                .price(dto.getPrice())
                .isAvailable(dto.getIsAvailable())
                .visitCount(dto.getVisitCount())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
}
