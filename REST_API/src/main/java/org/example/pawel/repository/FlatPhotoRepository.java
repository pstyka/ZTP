package org.example.pawel.repository;

import org.example.pawel.entity.FlatPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlatPhotoRepository extends JpaRepository<FlatPhoto, Long> {
    Optional<FlatPhoto> findFirstByFlatId(Long flatId);

}
