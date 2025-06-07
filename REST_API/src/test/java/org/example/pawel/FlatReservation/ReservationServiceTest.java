//package org.example.pawel.FlatReservation;
//
//import org.example.pawel.dto.ReservationDTO;
//import org.example.pawel.entity.Flat;
//import org.example.pawel.entity.Reservation;
//import org.example.pawel.mapper.ReservationDTOMapper;
//import org.example.pawel.repository.FlatRepository;
//import org.example.pawel.repository.ReservationRepository;
//import org.example.pawel.service.ReservationService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class ReservationServiceTest {
//
//    @Mock
//    private FlatRepository flatRepository;
//
//    @Mock
//    private ReservationRepository reservationRepository;
//
//    @Mock
//    private ReservationDTOMapper reservationDTOMapper;
//
//    @InjectMocks
//    private ReservationService reservationService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void shouldCreateReservation() {
//        Long flatId = 1L;
//        String userId = "user1";
//        Flat flat = new Flat();
//        flat.setId(flatId);
//        flat.setIsAvailable(true);
//
//        when(flatRepository.findById(flatId)).thenReturn(Optional.of(flat));
//
//        reservationService.createReservation(flatId, userId);
//
//        assertFalse(flat.getIsAvailable());
//        verify(flatRepository).save(flat);
//        verify(reservationRepository).save(any(Reservation.class));
//    }
//
//    @Test
//    void shouldThrowWhenFlatIsNotAvailable() {
//        UUID flatId = UUID.randomUUID();
//        String userId = "user1";
//        Flat flat = new Flat();
//        flat.setId(flatId);
//        flat.setIsAvailable(false);
//
//        when(flatRepository.findById(flatId)).thenReturn(Optional.of(flat));
//
//        Exception exception = assertThrows(RuntimeException.class, () ->
//                reservationService.createReservation(flatId, userId));
//
//        assertEquals("Flat is already reserved", exception.getMessage());
//        verify(reservationRepository, never()).save(any());
//    }
//
//    @Test
//    void shouldThrowWhenFlatNotFound() {
//        Long flatId = 1L;
//        String userId = "user1";
//
//        when(flatRepository.findById(flatId)).thenReturn(Optional.empty());
//
//        Exception exception = assertThrows(RuntimeException.class, () ->
//                reservationService.createReservation(flatId, userId));
//
//        assertEquals("Flat not found", exception.getMessage());
//    }
//
//    @Test
//    void shouldReturnUserReservations() {
//        String userId = "user1";
//        Reservation reservation = new Reservation();
//        ReservationDTO dto = new ReservationDTO();
//
//        when(reservationRepository.findAllByUserId(userId)).thenReturn(List.of(reservation));
//        when(reservationDTOMapper.mapToDTO(reservation)).thenReturn(dto);
//
//        List<ReservationDTO> result = reservationService.getReservationsForUser(userId);
//
//        assertEquals(1, result.size());
//        assertSame(dto, result.get(0));
//    }
//}
