package org.example.pawel.service;

import lombok.RequiredArgsConstructor;
import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.mapper.FlatDTOMapper;
import org.example.pawel.repository.FlatPhotoRepository;
import org.example.pawel.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
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

    @Autowired
    private FlatPhotosService flatPhotosService;

    public List<FlatDTO> getAllFlats() {
        return flatRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(flatDTOMapper::mapToDTO)
                .toList();
    }

    public Page<FlatDTO> getAllFlatsPaginated(Pageable pageable) {
        return flatRepository.findAll(pageable)
                .map(flatDTOMapper::mapToDTO);
    }

    public List<FlatDTO> searchFlats(String city, String rooms, String minPrice, String maxPrice,
                                     String isAvailable, String minArea, String maxArea) {

        city = blankToNull(city);
        rooms = blankToNull(rooms);
        minPrice = blankToNull(minPrice);
        maxPrice = blankToNull(maxPrice);
        isAvailable = blankToNull(isAvailable);
        minArea = blankToNull(minArea);
        maxArea = blankToNull(maxArea);

        FilterParams params = parseFilterParams(city, rooms, minPrice, maxPrice, isAvailable, minArea, maxArea);

        if (params.hasNoFilters()) {
            return flatRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                    .map(flatDTOMapper::mapToDTO)
                    .toList();
        }

        return flatRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .filter(flat -> params.cityFilter == null || flat.getCity().toLowerCase().startsWith(params.cityFilter))
                .filter(flat -> params.roomsValue == null || flat.getRooms().equals(params.roomsValue))
                .filter(flat -> params.minPriceValue == null || flat.getPrice() >= params.minPriceValue)
                .filter(flat -> params.maxPriceValue == null || flat.getPrice() <= params.maxPriceValue)
                .filter(flat -> params.isAvailableValue == null || flat.getIsAvailable().equals(params.isAvailableValue))
                .filter(flat -> params.minAreaValue == null || flat.getArea() >= params.minAreaValue)
                .filter(flat -> params.maxAreaValue == null || flat.getArea() <= params.maxAreaValue)
                .map(flatDTOMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public UUID addFlat(FlatDTO dto) {
        Flat flat = flatDTOMapper.mapToEntity(dto);
        flat.setVisitCount(0L);
        flat.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        flatRepository.save(flat);
        return flat.getId();
    }

    public UUID addFlatWithPhotos(FlatDTO flatDTO, List<MultipartFile> files) {
        Flat flat = flatDTOMapper.mapToEntity(flatDTO);
        Flat savedFlat = flatRepository.save(flat);

        List<FlatPhoto> photos = files.stream().map(file -> {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);

                Files.createDirectories(filePath.getParent());
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
        flatPhotosService.deletePhotosByFlatId(id);
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
        flat.setUpdatedAt(new java.sql.Timestamp(System.currentTimeMillis()));

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

    public List<FlatDTO> getFlatsByOwnerId(UUID ownerId) {
        return flatRepository.findByOwnerId(ownerId).stream()
                .map(flatDTOMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    private String blankToNull(String value) {
        return (value != null && value.isBlank()) ? null : value;
    }

    private FilterParams parseFilterParams(String city, String rooms, String minPrice, String maxPrice,
                                           String isAvailable, String minArea, String maxArea) {

        try {
            return new FilterParams(
                    (city != null) ? city.toLowerCase() : null,
                    (rooms != null) ? Integer.parseInt(rooms) : null,
                    (minPrice != null) ? Double.parseDouble(minPrice) : null,
                    (maxPrice != null) ? Double.parseDouble(maxPrice) : null,
                    (isAvailable != null) ? Boolean.parseBoolean(isAvailable) : null,
                    (minArea != null) ? Double.parseDouble(minArea) : null,
                    (maxArea != null) ? Double.parseDouble(maxArea) : null
            );
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Podane wartości liczbowych parametrów są nieprawidłowe.");
        }
    }

    private static class FilterParams {
        final String cityFilter;
        final Integer roomsValue;
        final Double minPriceValue;
        final Double maxPriceValue;
        final Boolean isAvailableValue;
        final Double minAreaValue;
        final Double maxAreaValue;

        FilterParams(String cityFilter, Integer roomsValue, Double minPriceValue, Double maxPriceValue,
                     Boolean isAvailableValue, Double minAreaValue, Double maxAreaValue) {
            this.cityFilter = cityFilter;
            this.roomsValue = roomsValue;
            this.minPriceValue = minPriceValue;
            this.maxPriceValue = maxPriceValue;
            this.isAvailableValue = isAvailableValue;
            this.minAreaValue = minAreaValue;
            this.maxAreaValue = maxAreaValue;
        }

        boolean hasNoFilters() {
            return cityFilter == null && roomsValue == null && minPriceValue == null && maxPriceValue == null &&
                    isAvailableValue == null && minAreaValue == null && maxAreaValue == null;
        }
    }

}
