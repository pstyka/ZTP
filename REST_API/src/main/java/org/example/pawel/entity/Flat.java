package org.example.pawel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Flat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String name;
    private String description;
    private String city;
    private String district;
    private String street;
    private String buildingNumber;
    private String flatNumber;
    private String postalCode;
    private Integer rooms;
    private Double area;
    private Double price;
    private Boolean isAvailable;

    @Column(nullable = false)
    private Long visitCount = 0L;

    @OneToMany(mappedBy = "flat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlatPhoto> photos;


    @OneToMany(mappedBy = "flat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;

}
