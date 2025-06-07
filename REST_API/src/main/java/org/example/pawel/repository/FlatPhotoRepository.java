package org.example.pawel.repository;

import org.example.pawel.entity.FlatPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FlatPhotoRepository extends JpaRepository<FlatPhoto, UUID> {


    List<FlatPhoto> findAllByFlatId(UUID flatId);

}
