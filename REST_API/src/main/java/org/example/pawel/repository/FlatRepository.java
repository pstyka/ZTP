package org.example.pawel.repository;

import org.example.pawel.entity.Flat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FlatRepository extends JpaRepository<Flat, UUID> {

    List<Flat> findByOwnerId(UUID ownerId);
}
