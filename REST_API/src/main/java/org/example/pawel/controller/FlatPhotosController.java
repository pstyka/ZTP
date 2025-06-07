package org.example.pawel.controller;

import lombok.RequiredArgsConstructor;
import org.example.pawel.service.FlatPhotosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/flats")
@RequiredArgsConstructor
public class FlatPhotosController {

    private final FlatPhotosService flatPhotoService;

    @PostMapping("/{flatId}/photos")
    public ResponseEntity<Void> uploadPhotos(@PathVariable Long flatId,
                                             @RequestParam("photos") List<MultipartFile> photos) {
        flatPhotoService.addPhotos(flatId, photos);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{flatId}/photos")
    public ResponseEntity<List<String>> getPhotoUrls(@PathVariable Long flatId) {
        return ResponseEntity.ok(flatPhotoService.getPhotoUrlsByFlatId(flatId));
    }
}

