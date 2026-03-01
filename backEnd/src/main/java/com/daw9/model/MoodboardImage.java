package com.daw9.model;

import com.daw9.model.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "moodboard_images")
@Data
@NoArgsConstructor
public class MoodboardImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private Client client;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "file_name")
    private String fileName;

    @Enumerated(EnumType.STRING)
    private StyleType style;

    @Enumerated(EnumType.STRING)
    private PaletteType palette;

    @Enumerated(EnumType.STRING)
    private AmbianceType ambiance;

    @Enumerated(EnumType.STRING)
    private BudgetType budgetPercu;

    @Enumerated(EnumType.STRING)
    private CategoriePrestataire categorie;

    @Column(name = "sous_categorie")
    private String sousCategorie;

    private Integer confidence;

    @Column(name = "couleur_dominante")
    private String couleurDominante;

    @Column(name = "analysis_status")
    private String analysisStatus = "PENDING";
}
