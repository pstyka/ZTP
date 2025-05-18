package org.example.pawel.mapper;

import org.example.pawel.dto.ReservationDTO;
import org.example.pawel.entity.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationDTOMapper {

    @Autowired
    private FlatDTOMapper flatDTOMapper;

    public ReservationDTO mapToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setFlatId(reservation.getFlat().getId());
        dto.setFlat(flatDTOMapper.mapToDTO(reservation.getFlat()));
        dto.setReservedAt(reservation.getReservedAt());
        return dto;
    }
}
