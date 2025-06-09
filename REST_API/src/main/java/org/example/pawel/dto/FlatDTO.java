package org.example.pawel.dto;

import lombok.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlatDTO {
    private UUID id;
    private UUID ownerId;
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
    private Timestamp createdAt;
    private Timestamp updatedAt;

    private List<String> photos;

}
