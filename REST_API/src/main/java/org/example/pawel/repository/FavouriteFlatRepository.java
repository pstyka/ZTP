package org.example.pawel.repository;

import org.example.pawel.entity.FavouriteFlat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavouriteFlatRepository extends JpaRepository<FavouriteFlat, UUID> {
    List<FavouriteFlat> findAllByUserId(String userId);

    void deleteByUserIdAndFlatId(String userId, UUID flatId);
}
