package org.example.pawel.config;

import lombok.RequiredArgsConstructor;
import org.example.pawel.entity.Flat;
import org.example.pawel.entity.FlatPhoto;
import org.example.pawel.entity.User;
import org.example.pawel.entity.UserRole;
import org.example.pawel.repository.FlatRepository;
import org.example.pawel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final FlatRepository flatRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:/uploads}")
    private String uploadDir;

    @Override
    public void run(String... args) {
        if (flatRepository.count() == 0) {
            List<User> users = new ArrayList<>();
            if (userRepository.count() == 0) {
                users = List.of(
                    createUser("Anna", "Kowalska", "anna@example.com", "123456789"),
                    createUser("Piotr", "Nowak", "piotr@example.com", "987654321"),
                    createUser("Marta", "Wiśniewska", "marta@example.com", "555444333"),
                    createUser("Tomasz", "Lewandowski", "tomek@example.com", "999888777"),
                    createUser("Kasia", "Mazur", "kasia@example.com", "112233445"),
                    createUser("Adam", "Wójcik", "adam@example.com", "667788990"),
                    createUser("Kuba", "Rodzeń", "kowalskipro6@gmail.com", "791020562")
                );
            }

            List<Flat> flats = List.of(

                createFlat(users.get(0).getId(), "Sunny Studio", "Cozy studio in Kraków with lots of light", "Kraków", "Kazimierz", "Starowiślna", "12", "4", "31-038", 1, 30.0, 1800.0, true, "flat1.png"),
                createFlat(users.get(1).getId(), "Family Apartment", "Spacious 3-room apartment ideal for families", "Kraków", "Podgórze", "Kalwaryjska", "45", "2", "30-504", 3, 65.0, 2800.0, true, "flat2.png"),
                createFlat(users.get(2).getId(), "Student Flat", "Affordable flat close to universities", "Kraków", "Krowodrza", "Lea", "21", "6", "30-052", 2, 40.0, 2000.0, true, "flat3.png"),
                createFlat(users.get(3).getId(), "Modern Loft", "Stylish loft with modern amenities", "Kraków", "Stare Miasto", "Długa", "5", "3", "31-147", 2, 55.0, 3200.0, true, "flat4.png"),
                createFlat(users.get(4).getId(), "Business Suite", "Luxury apartment for business stays", "Kraków", "Grzegórzki", "Rondo Mogilskie", "1", "10", "31-516", 2, 60.0, 4500.0, true, "flat5.png"),
                createFlat(users.get(5).getId(), "Old Town Gem", "Charming apartment in the heart of Kraków", "Kraków", "Stare Miasto", "Floriańska", "18", "2", "31-019", 1, 35.0, 2500.0, true, "flat6.png")
            );

            System.out.println("Inserting sample flats into database...");
            flatRepository.saveAll(flats);
            System.out.println("Inserted " + flats.size() + " flats.");
        }
    }

    private Flat createFlat(UUID ownerId, String name, String desc, String city, String district, String street, String building, String flatNum,
        String postalCode, int rooms, double area, double price, boolean available, String photoFileName) {

        Flat flat = Flat.builder()
            .ownerId(ownerId)
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
            .createdAt(new Timestamp(System.currentTimeMillis()))
            .updatedAt(new Timestamp(System.currentTimeMillis()))
            .build();

        try {
            ClassPathResource resource = new ClassPathResource("flatPhotos/" + photoFileName);
            byte[] imageData = resource.getInputStream().readAllBytes();

            String fileName = UUID.randomUUID() + "_" + photoFileName;
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            Path targetPath = uploadPath.resolve(fileName);
            Files.write(targetPath, imageData);

            String photoUrl = "/uploads/" + fileName;

            FlatPhoto photo = FlatPhoto.builder()
                .flat(flat)
                .url(photoUrl)
                .build();

            flat.setPhotos(List.of(photo));

        } catch (IOException e) {
            System.err.println("Could not load or save photo " + photoFileName + ": " + e.getMessage());
        }

        return flat;
    }

    public User createUser(String firstName, String lastName, String email, String phone) {
        User user = User.builder()
            .id(UUID.randomUUID())
            .firstName(firstName)
            .lastName(lastName)
            .email(email)
            .phone(phone)
            .passwordHash("$2b$12$t3doRo4w4cnBK06N9.C7DuHJl34Ivsr4AVXDeDjFxZlAPEuSx./Aa")
            .role(UserRole.USER)
            .build();
        return userRepository.save(user);
    }
}
