package org.example.pawel.repository;

import org.example.pawel.entity.FavouriteFlat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouriteFlatRepository extends JpaRepository<FavouriteFlat, Long> {
    List<FavouriteFlat> findAllByUserId(String userId);

    boolean existsByUserIdAndFlatId(String userId, Long flatId);

    void deleteByUserIdAndFlatId(String userId, Long flatId);
}
