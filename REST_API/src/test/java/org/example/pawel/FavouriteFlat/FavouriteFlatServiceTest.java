//package org.example.pawel.FavouriteFlat;
//
//import org.example.pawel.dto.FlatDTO;
//import org.example.pawel.entity.FavouriteFlat;
//import org.example.pawel.entity.Flat;
//import org.example.pawel.mapper.FlatDTOMapper;
//import org.example.pawel.repository.FavouriteFlatRepository;
//import org.example.pawel.repository.FlatRepository;
//import org.example.pawel.service.FavouriteFlatService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.*;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.Mockito.*;
//
//class FavouriteFlatServiceTest {
//
//    @Mock
//    private FlatRepository flatRepository;
//
//    @Mock
//    private FavouriteFlatRepository favouriteFlatRepository;
//
//    @Mock
//    private FlatDTOMapper flatDTOMapper;
//
//    @InjectMocks
//    private FavouriteFlatService favouriteFlatService;
//
//    private Flat flat;
//    private FlatDTO flatDTO;
//    private FavouriteFlat fav;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//
//        flat = Flat.builder()
//                .id(1L)
//                .name("Flat A")
//                .description("Nice")
//                .city("City")
//                .district("District")
//                .street("Street")
//                .buildingNumber("1")
//                .flatNumber("2")
//                .postalCode("00-001")
//                .rooms(2)
//                .area(50.0)
//                .price(2000.0)
//                .isAvailable(true)
//                .build();
//
//        flatDTO = FlatDTO.builder()
//                .name("Flat A")
//                .city("City")
//                .price(2000.0)
//                .isAvailable(true)
//                .build();
//
//        fav = new FavouriteFlat();
//        fav.setFlatId(1L);
//        fav.setUserId("user-123");
//        fav.setAddedAt(LocalDateTime.now());
//    }
//
//    @Test
//    void shouldReturnUserFavorites() {
//        when(favouriteFlatRepository.findAllByUserId("user-123")).thenReturn(List.of(fav));
//        when(flatRepository.findAllById(List.of(1L))).thenReturn(List.of(flat));
//        when(flatDTOMapper.mapToDTO(flat)).thenReturn(flatDTO);
//
//        List<FlatDTO> result = favouriteFlatService.getUserFavorites("user-123");
//
//        assertThat(result).containsExactly(flatDTO);
//        verify(favouriteFlatRepository).findAllByUserId("user-123");
//        verify(flatRepository).findAllById(List.of(1L));
//    }
//
//    @Test
//    void shouldAddToFavorites() {
//        ArgumentCaptor<FavouriteFlat> captor = ArgumentCaptor.forClass(FavouriteFlat.class);
//
//        favouriteFlatService.addFavorite(1L, "user-123");
//
//        verify(favouriteFlatRepository).save(captor.capture());
//        FavouriteFlat saved = captor.getValue();
//
//        assertThat(saved.getFlatId()).isEqualTo(1L);
//        assertThat(saved.getUserId()).isEqualTo("user-123");
//        assertThat(saved.getAddedAt()).isNotNull();
//    }
//
//    @Test
//    void shouldRemoveFromFavorites() {
//        favouriteFlatService.removeFavorite(1L, "user-123");
//
//        verify(favouriteFlatRepository).deleteByUserIdAndFlatId("user-123", 1L);
//    }
//
//    @Test
//    void shouldCreateFavouriteFlat() {
//        FavouriteFlat result = favouriteFlatService.createFavouriteFlat("user-123", 1L);
//
//        assertThat(result.getUserId()).isEqualTo("user-123");
//        assertThat(result.getFlatId()).isEqualTo(1L);
//        assertThat(result.getAddedAt()).isNotNull();
//    }
//}
