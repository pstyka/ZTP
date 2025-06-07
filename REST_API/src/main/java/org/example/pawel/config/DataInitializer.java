package org.example.pawel.config;

import lombok.RequiredArgsConstructor;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.repository.FlatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final FlatRepository flatRepository;

    @Override
    public void run(String... args) {
        if (flatRepository.count() == 0) {
            List<Flat> flats = List.of(
                    createFlat("Sunny Studio", "Cozy studio in Kraków with lots of light", "Kraków", "Kazimierz", "Starowiślna", "12", "4", "31-038", 1, 30.0, 1800.0, true, "flat1.png"),
                    createFlat("Family Apartment", "Spacious 3-room apartment ideal for families", "Kraków", "Podgórze", "Kalwaryjska", "45", "2", "30-504", 3, 65.0, 2800.0, true, "flat2.png"),
                    createFlat("Student Flat", "Affordable flat close to universities", "Kraków", "Krowodrza", "Lea", "21", "6", "30-052", 2, 40.0, 2000.0, true, "flat3.png"),
                    createFlat("Modern Loft", "Stylish loft with modern amenities", "Kraków", "Stare Miasto", "Długa", "5", "3", "31-147", 2, 55.0, 3200.0, true, "flat4.png"),
                    createFlat("Business Suite", "Luxury apartment for business stays", "Kraków", "Grzegórzki", "Rondo Mogilskie", "1", "10", "31-516", 2, 60.0, 4500.0, true, "flat5.png"),
                    createFlat("Old Town Gem", "Charming apartment in the heart of Kraków", "Kraków", "Stare Miasto", "Floriańska", "18", "2", "31-019", 1, 35.0, 2500.0, true, "flat6.png")
            );
            System.out.println("Inserting sample flats into database...");
            flatRepository.saveAll(flats);
            System.out.println("Inserted " + flats.size() + " flats.");
        }
    }

    private Flat createFlat(String name, String desc, String city, String district, String street, String building, String flatNum,
                            String postalCode, int rooms, double area, double price, boolean available, String photoFileName) {
        Flat flat = Flat.builder()
                .name(name)
                .description(desc)
                .city(city)
                .district(district)
                .street(street)
                .buildingNumber(building)
                .flatNumber(flatNum)
                .postalCode(postalCode)
                .rooms(rooms)
                .area(area)
                .price(price)
                .isAvailable(available)
                .visitCount(0L)
                .build();

        try {
            // Wczytaj dane obrazka
            ClassPathResource resource = new ClassPathResource("flatPhotos/" + photoFileName);
            byte[] photoData = resource.getInputStream().readAllBytes();

            // Pobierz rozszerzenie
            String extension = photoFileName.substring(photoFileName.lastIndexOf('.') + 1).toLowerCase();

            // Określ contentType ręcznie (bez probeContentType, które działa kiepsko w JAR)
            String contentType = switch (extension) {
                case "jpg", "jpeg" -> "image/jpeg";
                case "png" -> "image/png";
                case "gif" -> "image/gif";
                case "bmp" -> "image/bmp";
                default -> "application/octet-stream"; // fallback
            };

            FlatPhoto photo = FlatPhoto.builder()
                    .imageData(photoData)
                    .contentType(contentType)
                    .flat(flat)
                    .build();

            flat.setPhotos(List.of(photo));

        } catch (IOException e) {
            System.err.println("Could not load photo " + photoFileName + ": " + e.getMessage());
        }

        return flat;
    }

}
