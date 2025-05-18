package org.example.pawel.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.pawel.dto.FlatDTO;
import org.example.pawel.service.FavouriteFlatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/favourites")
@Tag(name = "Favourite Flats", description = "Operations related to user's favourite flats")
public class FavouritesController {

    @Autowired
    private FavouriteFlatService favouriteFlatService;

    @Operation(summary = "Get favourite flats", description = "Returns a list of flats marked as favourite by the user.")
    @GetMapping("/favourite-list")
    public ResponseEntity<List<FlatDTO>> getFavouriteList(@RequestHeader("X-User-ID") String userId) {
        List<FlatDTO> favouriteFlats = favouriteFlatService.getUserFavorites(userId);
        return ResponseEntity.ok(favouriteFlats);
    }

    @Operation(summary = "Add flat to favourite list", description = "Adds a flat to the user's favourite list.")
    @PostMapping("/{flatId}")
    public ResponseEntity<?> addFlatToFavouriteList(@PathVariable Long flatId, @RequestHeader("X-User-ID") String userId) {
        favouriteFlatService.addFavorite(flatId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Remove flat from favourite list", description = "Removes a flat from the user's favourite list.")
    @DeleteMapping("/{flatId}")
    public ResponseEntity<?> removeFlatFromFavouriteList(@PathVariable Long flatId, @RequestHeader("X-User-ID") String userId) {
        favouriteFlatService.removeFavorite(flatId, userId);
        return ResponseEntity.noContent().build();
    }

}
