package org.example.pawel.service;

import lombok.RequiredArgsConstructor;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.repository.FlatPhotoRepository;
import org.example.pawel.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlatPhotosService {

    private final FlatRepository flatRepository;
    private final FlatPhotoRepository flatPhotoRepository;

    @Value("${app.upload.dir:/uploads}")
    private String uploadDir;

    public void addPhotos(UUID flatId, List<MultipartFile> files) {
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new RuntimeException("Flat not found"));

        List<FlatPhoto> photos = files.stream().map(file -> {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);

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

    public List<String> getPhotoUrlsByFlatId(UUID flatId) {
        return flatPhotoRepository.findAllByFlatId(flatId).stream()
                .map(FlatPhoto::getUrl)
                .toList();
    }

    public void deletePhotosByFlatId(UUID flatId) {
        List<FlatPhoto> photos = flatPhotoRepository.findAllByFlatId(flatId);
        flatPhotoRepository.deleteAll(photos);

        for (FlatPhoto photo : photos) {
            try {
                Path filePath = Paths.get(uploadDir, photo.getUrl().replace("/uploads/", ""));
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete file: " + e.getMessage());
            }
        }
    }

    public void deletePhotoById(UUID photoId) {
        FlatPhoto photo = flatPhotoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        flatPhotoRepository.delete(photo);

        try {
            Path filePath = Paths.get(uploadDir, photo.getUrl().replace("/uploads/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + e.getMessage());
        }
    }


    public void updatePhotos(UUID flatId, List<MultipartFile> files) {
        deletePhotosByFlatId(flatId);
        addPhotos(flatId, files);
    }
}