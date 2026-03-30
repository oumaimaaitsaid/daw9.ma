package com.daw9.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public record CatalogueItemDTO(
    Long id,
    String nom,
    String description,
    BigDecimal prix,
    BigDecimal prixParPersonne,
    String categorie,
    String sousCategorie,
    String type,
    String couleurDominante,
    Set<String> couleurs,
    List<String> images
) {}
