package org.example.pawel.entity;

import jakarta.persistence.*;
import lombok.*;

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

}
