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
@RequestMapping("/rest/flats")
@RequiredArgsConstructor
public class FlatPhotosController {
    @Autowired
    private final FlatPhotosService flatPhotoService;

    @PostMapping(value = "/{flatId}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadFlatPhotos(
            @PathVariable Long flatId,
            @RequestPart("photos") List<MultipartFile> photos) {
        flatPhotoService.addPhotos(flatId, photos);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{flatId}/photos")
    public ResponseEntity<byte[]> getFirstPhotoByFlatId(@PathVariable Long flatId) {
        return flatPhotoService.getFirstPhotoByFlatId(flatId)
                .map(photo -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(photo.getContentType()));
                    return new ResponseEntity<>(photo.getImageData(), headers, HttpStatus.OK);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
