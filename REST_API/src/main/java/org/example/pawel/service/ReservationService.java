package org.example.pawel.service;

import org.example.pawel.dto.ReservationDTO;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.Reservation;
import org.example.pawel.mapper.ReservationDTOMapper;
import org.example.pawel.repository.FlatRepository;
import org.example.pawel.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private ReservationDTOMapper reservationDTOMapper;

    public void createReservation(UUID flatId, String userId) {
        Flat flat = getFlatById(flatId);

        checkFlatAvailability(flat);
        Reservation reservation = createReservationEntity(flat, userId);

        flat.setIsAvailable(false);
        flatRepository.save(flat);
        reservationRepository.save(reservation);
    }

    public List<ReservationDTO> getReservationsForUser(String userId) {
        return reservationRepository.findAllByUserId(userId).stream()
                .map(reservationDTOMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    private Flat getFlatById(UUID flatId) {
        return flatRepository.findById(flatId)
                .orElseThrow(() -> new RuntimeException("Flat not found"));
    }
    private void checkFlatAvailability(Flat flat) {
        if (!Boolean.TRUE.equals(flat.getIsAvailable())) {
            throw new RuntimeException("Flat is already reserved");
        }
    }


    private Reservation createReservationEntity(Flat flat, String userId) {
        Reservation reservation = new Reservation();
        reservation.setFlat(flat);
        reservation.setUserId(userId);
        reservation.setReservedAt(LocalDateTime.now());
        return reservation;
    }

}
