package com.daw9.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ReservationResponseDTO {
    private Long id;
    private LocalDate dateEvenement;
    private Integer nombreInvites;
    private BigDecimal montantTotal;
    private String status;
    private String ville;
    private String message;
    private UserSummaryDTO client;
    private List<CatalogueItemDTO> items;

    private CatalogueItemDTO negafa;
    private CatalogueItemDTO traiteur;
    private CatalogueItemDTO photographe;
}