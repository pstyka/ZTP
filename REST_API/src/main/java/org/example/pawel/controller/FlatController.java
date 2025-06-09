package org.example.pawel.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.pawel.dto.FlatDTO;
import org.example.pawel.service.FlatPhotosService;
import org.example.pawel.service.FlatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Tag(name = "Flats", description = "Operations related to managing rental flats")
@RestController
@RequestMapping("/rest/flats")
public class FlatController {

    @Autowired
    private FlatService flatService;

    @Autowired
    private FlatPhotosService flatPhotosService;

    @Operation(summary = "Get all flats", description = "Returns a list of all flats available in the system.")
    @GetMapping
    public List<FlatDTO> getAllFlats() {
        return flatService.getAllFlats();
    }

    @Operation(summary = "Search flats", description = "Search flats based on filter criteria: city, rooms, min/max price, availability, and area.")
    @GetMapping("/search")
    public List<FlatDTO> searchFlats(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer rooms,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean isAvailable,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea
    ) {
        return flatService.searchFlats(city, rooms, minPrice, maxPrice, isAvailable, minArea, maxArea);
    }

    @Operation(summary = "Create a new flat", description = "Adds a new flat to the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Flat successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<UUID> createFlat(@RequestBody FlatDTO flatDTO) {
        UUID flatId = flatService.addFlat(flatDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(flatId);
    }

    @PostMapping("/with-photos")
    public ResponseEntity<UUID> createFlatWithPhotos(
            @RequestPart("flat") FlatDTO flatDTO,
            @RequestPart("photos") List<MultipartFile> photos) {

        UUID flatId = flatService.addFlatWithPhotos(flatDTO, photos);
        return ResponseEntity.status(HttpStatus.CREATED).body(flatId);
    }

    @Operation(summary = "Delete a flat", description = "Deletes a flat by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Flat successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Flat not found with the given ID")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlat(@PathVariable UUID id) {
        flatService.deleteFlat(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update a flat", description = "Updates the details of a flat using its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flat successfully updated"),
            @ApiResponse(responseCode = "404", description = "Flat not found with the given ID")
    })
    @PutMapping("/{id}")
    public ResponseEntity<FlatDTO> updateFlat(@PathVariable UUID id, @RequestBody FlatDTO flatDTO) {
        return ResponseEntity.ok(flatService.updateFlat(id, flatDTO));
    }

    @Operation(summary = "Get flat by ID")
    @GetMapping("/{id}")
    public ResponseEntity<FlatDTO> getFlat(@PathVariable UUID id) {
        FlatDTO flatDTO = flatService.getFlatById(id);
        return ResponseEntity.ok(flatDTO);
    }

    @Operation(summary = "Get flat by ownerID")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<FlatDTO>> getFlatsByOwnerId(
            @Parameter(description = "Owner ID to filter flats by owner") @PathVariable UUID ownerId) {
        List<FlatDTO> flats = flatService.getFlatsByOwnerId(ownerId);
        return ResponseEntity.ok(flats);
    }

}
