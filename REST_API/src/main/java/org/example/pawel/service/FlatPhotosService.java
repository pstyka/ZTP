package org.example.pawel.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.repository.FlatPhotoRepository;
import org.example.pawel.repository.FlatRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlatPhotosService {

    private final FlatRepository flatRepository;
    private final FlatPhotoRepository flatPhotoRepository;

    private final String uploadDir = "uploads"; // katalog lokalny, np. src/main/resources/static/uploads

    public void addPhotos(Long flatId, List<MultipartFile> files) {
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new RuntimeException("Flat not found"));

        List<FlatPhoto> photos = files.stream().map(file -> {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);

                // Utwórz folder, jeśli nie istnieje
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());

                String photoUrl = "/uploads/" + fileName;

                return FlatPhoto.builder()
                        .flat(flat)
                        .url(photoUrl)
                        .build();
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }).toList();

        flatPhotoRepository.saveAll(photos);
    }

    public List<String> getPhotoUrlsByFlatId(Long flatId) {
        return flatPhotoRepository.findAllByFlatId(flatId).stream()
                .map(FlatPhoto::getUrl)
                .toList();
    }
}


