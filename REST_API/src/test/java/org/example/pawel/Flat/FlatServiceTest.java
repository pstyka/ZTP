package org.example.pawel.Flat;

import org.example.pawel.dto.FlatDTO;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.mapper.FlatDTOMapper;
import org.example.pawel.repository.FlatRepository;
import org.example.pawel.service.FlatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class FlatServiceTest {

    @Mock
    private FlatRepository flatRepository;

    @Mock
    private FlatDTOMapper flatDTOMapper;

    @InjectMocks
    private FlatService flatService;

    private Flat flat1;
    private Flat flat2;
    private FlatDTO dto1;
    private FlatDTO dto2;
    private MockMultipartFile mockPhoto;

    public FlatServiceTest() throws IOException {
        ClassPathResource imageFile = new ClassPathResource("flatphotos/flat1.png");
        mockPhoto = new MockMultipartFile(
                "photos",
                "flat1.png",
                "image/png",
                imageFile.getInputStream()
        );
    }

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);

        flat1 = Flat.builder()
                .id(1L)
                .name("Flat A")
                .description("Nice")
                .city("Warsaw")
                .district("Mokotów")
                .street("Main")
                .buildingNumber("10")
                .flatNumber("1")
                .postalCode("00-001")
                .rooms(2)
                .area(50.0)
                .price(2000.0)
                .isAvailable(true)
                .build();

        flat2 = Flat.builder()
                .id(2L)
                .name("Flat B")
                .description("Big")
                .city("Krakow")
                .district("Centrum")
                .street("Green")
                .buildingNumber("20")
                .flatNumber("2")
                .postalCode("30-002")
                .rooms(3)
                .area(75.0)
                .price(3000.0)
                .isAvailable(false)
                .build();

        dto1 = buildFlatDTO("Flat A", "Warsaw", 2000.0, true);
        dto2 = buildFlatDTO("Flat B", "Krakow", 3000.0, false);

        when(flatDTOMapper.mapToDTO(flat1)).thenReturn(dto1);
        when(flatDTOMapper.mapToDTO(flat2)).thenReturn(dto2);
        when(flatDTOMapper.mapToEntity(dto1)).thenReturn(flat1);
    }

    private FlatDTO buildFlatDTO(String name, String city, double price, boolean isAvailable) {
        return FlatDTO.builder()
                .name(name)
                .city(city)
                .price(price)
                .isAvailable(isAvailable)
                .build();
    }

    @Test
    void shouldReturnAllFlats() {
        when(flatRepository.findAll()).thenReturn(List.of(flat1, flat2));

        List<FlatDTO> result = flatService.getAllFlats();

        assertThat(result).containsExactly(dto1, dto2);
        verify(flatRepository).findAll();
    }

    @Test
    void shouldSearchFlatsByCityAndAvailability() {
        when(flatRepository.findAll()).thenReturn(List.of(flat1, flat2));

        List<FlatDTO> result = flatService.searchFlats("Warsaw", null, null, null, true, null, null);

        assertThat(result).containsExactly(dto1);
    }

    @Test
    void shouldAddFlatWithPhoto() {
        when(flatRepository.save(any(Flat.class))).thenReturn(flat1);
        when(flatDTOMapper.mapToDTO(any(Flat.class))).thenReturn(dto1);
        when(flatDTOMapper.mapToEntity(dto1)).thenReturn(flat1);

        Long result = flatService.addFlat(dto1);

        assertThat(result).isNotNull();
        verify(flatRepository).save(any(Flat.class));
    }

    @Test
    void shouldUpdateFlat() {
        when(flatRepository.findById(1L)).thenReturn(Optional.of(flat1));
        when(flatRepository.save(flat1)).thenReturn(flat1);
        when(flatDTOMapper.mapToDTO(flat1)).thenReturn(dto1);

        FlatDTO result = flatService.updateFlat(1L, dto1);

        assertThat(result).isEqualTo(dto1);
        verify(flatRepository).save(flat1);
    }

    @Test
    void shouldDeleteFlat() {
        flatService.deleteFlat(1L);
        verify(flatRepository).deleteById(1L);
    }
}
