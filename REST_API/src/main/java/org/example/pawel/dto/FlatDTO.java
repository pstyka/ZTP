package org.example.pawel.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FlatDTO {
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
