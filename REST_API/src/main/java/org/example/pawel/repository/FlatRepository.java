package org.example.pawel.repository;

import org.example.pawel.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FlatRepository extends JpaRepository<Flat, UUID> {

}
