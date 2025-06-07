package org.example.pawel.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlatDTO {
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
    private Long visitCount;

}
