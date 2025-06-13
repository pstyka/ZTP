package org.example.pawel.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.pawel.service.FlatPhotosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rest/flats")
@RequiredArgsConstructor
@Tag(name = "Flat Photos", description = "Operations related to managing photos of rental flats")
public class FlatPhotosController {

    private final FlatPhotosService flatPhotoService;

    @Operation(summary = "Upload photos for a flat", description = "Uploads photos for a specific flat.")
    @PostMapping("/{flatId}/photos")
    public ResponseEntity<Void> uploadPhotos(@PathVariable UUID flatId,
                                             @RequestParam("photos") List<MultipartFile> photos) {
        flatPhotoService.addPhotos(flatId, photos);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get photos by flatID", description = "Retrieves a photos for a specific flat.")
    @GetMapping("/{flatId}/photos")
    public ResponseEntity<List<String>> getPhotoUrls(@PathVariable UUID flatId) {
        return ResponseEntity.ok(flatPhotoService.getPhotoUrlsByFlatId(flatId));
    }

    @Operation(summary = "Delete photos by flatID", description = "Deletes all photos for a specific flat.")
    @DeleteMapping("/{flatId}/photos")
    public ResponseEntity<Void> deletePhotos(@PathVariable UUID flatId) {
        flatPhotoService.deletePhotosByFlatId(flatId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a specific photo", description = "Deletes a specific photo by its ID.")
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(@PathVariable UUID photoId) {
        flatPhotoService.deletePhotoById(photoId);
        return ResponseEntity.noContent().build();
    }
}

