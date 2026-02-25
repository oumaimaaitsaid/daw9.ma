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

    // Prix par personne (pour traiteur)
    private BigDecimal prixParPersonne;

    // Catégorie parent: negafa, ziana, traiteur, photographe, dj
    private String categorie;

    // Sous-catégorie: caftan, takchita, maquillage, etc.
    private String sousCategorie;

    // Type spécifique (ex: pour lebsa -> fassiya, rbatiya, sahraouia, soussia, chamalia)
    private String type;

    // Couleur dominante de la tenue (pour le matching par couleur)
    @Column(name = "couleur_dominante")
    private String couleurDominante;

    // Champs dynamiques selon le type (couleurs secondaires optionnelles)
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

    // Profil de style analysé par IA (pour le matching)
    @Enumerated(EnumType.STRING)
    @Column(name = "style_profile_style")
    private com.daw9.model.enums.StyleType style;

    @Enumerated(EnumType.STRING)
    @Column(name = "style_profile_palette")
    private com.daw9.model.enums.PaletteType palette;

    @Enumerated(EnumType.STRING)
    @Column(name = "style_profile_ambiance")
    private com.daw9.model.enums.AmbianceType ambiance;

    @Enumerated(EnumType.STRING)
    @Column(name = "style_profile_budget")
    private com.daw9.model.enums.BudgetType budgetPercu;
}
