package org.example.pawel.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.mapper.FlatDTOMapper;
import org.example.pawel.repository.FlatPhotoRepository;
import org.example.pawel.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlatService {

    @Value("${app.upload.dir:/uploads}")
    private String uploadDir;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private FlatDTOMapper flatDTOMapper;

    @Autowired
    private final FlatPhotoRepository flatPhotoRepository;



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

    public UUID addFlat(FlatDTO dto) {
        Flat flat = flatDTOMapper.mapToEntity(dto);
        flat.setVisitCount(0L);
        flatRepository.save(flat);
        return flat.getId();
    }

    public UUID addFlatWithPhotos(FlatDTO flatDTO, List<MultipartFile> files) {
        Flat flat = flatDTOMapper.mapToEntity(flatDTO);
        Flat savedFlat = flatRepository.save(flat); // najpierw zapisujemy mieszkanie

        List<FlatPhoto> photos = files.stream().map(file -> {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);

                Files.createDirectories(filePath.getParent()); // utwórz folder, jeśli nie istnieje
                Files.write(filePath, file.getBytes());

                String photoUrl = "/uploads/" + fileName;

                return FlatPhoto.builder()
                        .flat(savedFlat)
                        .url(photoUrl)
                        .build();
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }).toList();

        flatPhotoRepository.saveAll(photos);
        return savedFlat.getId();
    }


    public void deleteFlat(UUID id) {
        flatRepository.deleteById(id);
    }

    public FlatDTO updateFlat(UUID id, FlatDTO flatDTO) {
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

    public FlatDTO getFlatById(UUID id) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flat not found with id " + id));

        flat.setVisitCount(flat.getVisitCount() + 1);
        flatRepository.save(flat);

        return flatDTOMapper.mapToDTO(flat);
    }

}
