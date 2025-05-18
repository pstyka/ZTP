package org.example.pawel.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.pawel.dto.ReservationDTO;
import org.example.pawel.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reservartion", description = "Operations related to make a flat reservation")
@RestController
@RequestMapping("/rest/reservations")
public class ReservationController {

    private ReservationService reservationService;

    @PostMapping("/create-reservation")
    @Operation(summary = "Create a reservation", description = "Creates a reservation.")
    public ResponseEntity<?> createReservation(@RequestBody ReservationDTO reservationDTO, @RequestHeader("X-User-Id") String userId) {
        reservationService.createReservation(reservationDTO.getFlatId(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Get user's reservations", description = "Returns all reservations made by the current user.")
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getUserReservations(@RequestHeader("X-User-Id") String userId) {
        List<ReservationDTO> reservations = reservationService.getReservationsForUser(userId);
        return ResponseEntity.ok(reservations);
    }
}
