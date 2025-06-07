package org.example.pawel.service;

import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.FavouriteFlat;
import org.example.pawel.mapper.FlatDTOMapper;
import org.example.pawel.repository.FavouriteFlatRepository;
import org.example.pawel.repository.FlatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FavouriteFlatService {

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private FavouriteFlatRepository favouriteFlatRepository;

    @Autowired
    private FlatDTOMapper flatDTOMapper;

    public List<FlatDTO> getUserFavorites(String userId) {
        List<UUID> flatIds = favouriteFlatRepository.findAllByUserId(userId).stream()
                .map(FavouriteFlat::getFlatId)
                .toList();

        return flatRepository.findAllById(flatIds).stream()
                .map(flat -> flatDTOMapper.mapToDTO(flat))
                .toList();
    }

    public void addFavorite(UUID flatId, String userId) {
        FavouriteFlat favouriteFlat = createFavouriteFlat(userId, flatId);
        favouriteFlatRepository.save(favouriteFlat);
    }

    public void removeFavorite(UUID flatId, String userId) {
        favouriteFlatRepository.deleteByUserIdAndFlatId(userId, flatId);
    }

    public FavouriteFlat createFavouriteFlat(String userId, UUID flatId) {
        FavouriteFlat favouriteFlat = new FavouriteFlat();
        favouriteFlat.setUserId(userId);
        favouriteFlat.setFlatId(flatId);
        favouriteFlat.setAddedAt(LocalDateTime.now());
        return favouriteFlat;
    }

}
