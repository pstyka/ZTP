package org.example.pawel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlatPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url; // <-- ścieżka lub URL do pliku

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id")
    private Flat flat;
}


