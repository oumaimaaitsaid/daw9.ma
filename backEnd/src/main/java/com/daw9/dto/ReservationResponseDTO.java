package com.daw9.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class ReservationResponseDTO {
    private Long id;
    private LocalDate dateEvenement;
    private Integer nombreInvites;
    private BigDecimal montantTotal;
    private String status;
    private String ville;
    private String message;
    private Map<String, Object> client;
    private List<Map<String, Object>> items;

    private Map<String, Object> negafa;
    private Map<String, Object> traiteur;
    private Map<String, Object> photographe;
}