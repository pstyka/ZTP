package org.example.pawel.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationDTO {
    private Long flatId;
    private FlatDTO flat;
    private LocalDateTime reservedAt;

}
