package org.example.pawel.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReservationDTO {
    private UUID flatId;
    private FlatDTO flat;
    private LocalDateTime reservedAt;

}
