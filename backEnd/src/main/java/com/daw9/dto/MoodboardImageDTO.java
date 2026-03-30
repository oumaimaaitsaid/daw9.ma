package com.daw9.dto;

import com.daw9.model.StyleProfile;

public record MoodboardImageDTO(
    Long id,
    String imageUrl,
    String fileName,
    String categorie,
    String sousCategorie,
    Integer confidence,
    String couleurDominante,
    StyleProfile styleProfile,
    String analysisStatus
) {}
