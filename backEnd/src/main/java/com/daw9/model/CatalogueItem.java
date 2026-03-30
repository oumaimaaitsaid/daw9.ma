package com.daw9.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "catalogue_items")
@Data
public class CatalogueItem implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(length = 2000)
    private String description;

    private BigDecimal prix;

    private BigDecimal prixParPersonne;

    private String categorie;

    private String sousCategorie;

    private String type;

    @Column(name = "couleur_dominante")
    private String couleurDominante;

    @ElementCollection
    @CollectionTable(name = "cat_item_couleurs", joinColumns = @JoinColumn(name = "cat_item_id"))
    private Set<String> couleurs = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "cat_item_tailles", joinColumns = @JoinColumn(name = "cat_item_id"))
    private Set<String> tailles = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "cat_item_matieres", joinColumns = @JoinColumn(name = "cat_item_id"))
    private Set<String> matieres = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "cat_item_styles", joinColumns = @JoinColumn(name = "cat_item_id"))
    private Set<String> styles = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "cat_item_images", joinColumns = @JoinColumn(name = "cat_item_id"))
    private List<String> images = new ArrayList<>();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "style", column = @Column(name = "style_profile_style")),
            @AttributeOverride(name = "palette", column = @Column(name = "style_profile_palette")),
            @AttributeOverride(name = "ambiance", column = @Column(name = "style_profile_ambiance")),
            @AttributeOverride(name = "budgetPercu", column = @Column(name = "style_profile_budget"))
    })
    private StyleProfile styleProfile;
}
