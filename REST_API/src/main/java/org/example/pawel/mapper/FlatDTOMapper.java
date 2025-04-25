package org.example.pawel.mapper;

import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.Flat;
import org.springframework.stereotype.Service;

@Service
public class FlatDTOMapper {
    public FlatDTO mapToDTO(Flat flat) {
        return FlatDTO.builder()
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
                .build();
    }
}
