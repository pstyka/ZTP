package org.example.pawel.service;

import lombok.RequiredArgsConstructor;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.repository.FlatPhotoRepository;
import org.example.pawel.repository.FlatRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FlatPhotosService {
    private final FlatPhotoRepository flatPhotoRepository;
    private final FlatRepository flatRepository;

    public void addPhotos(Long flatId, List<MultipartFile> files) {
        Flat flat = flatRepository.findById(flatId)
                .orElseThrow(() -> new RuntimeException("Flat not found"));

        List<FlatPhoto> photos = files.stream().map(file -> {
            try {
                return FlatPhoto.builder()
                        .flat(flat)
                        .imageData(file.getBytes())
                        .contentType(file.getContentType())
                        .build();
            } catch (IOException e) {
                throw new RuntimeException("Error reading file", e);
            }
        }).toList();

        flat.getPhotos().addAll(photos);
        flatRepository.save(flat);
    }

    public Optional<FlatPhoto> getFirstPhotoByFlatId(Long flatId) {
        return flatPhotoRepository.findFirstByFlatId(flatId);
    }
}
