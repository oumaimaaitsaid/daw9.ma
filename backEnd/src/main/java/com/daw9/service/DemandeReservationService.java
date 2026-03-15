package com.daw9.service;

import com.daw9.dto.ReservationResponseDTO;
import com.daw9.model.CatalogueItem;
import com.daw9.model.DemandeReservation;
import com.daw9.repository.DemandeReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DemandeReservationService {

    private final DemandeReservationRepository reservationRepository;

    public List<ReservationResponseDTO> getClientReservations(Long clientId) {
        List<DemandeReservation> reservations = reservationRepository.findByClientId(clientId);

        return reservations.stream().map(res -> {
            ReservationResponseDTO dto = new ReservationResponseDTO();
            dto.setId(res.getId());
            dto.setDateEvenement(res.getDateEvenement());
            dto.setNombreInvites(res.getNombreInvites());
            dto.setMontantTotal(res.getMontantTotal() != null ? res.getMontantTotal() : BigDecimal.ZERO);
            dto.setStatus(res.getStatus().name());
            dto.setMessage(res.getMessage());

            if (res.getItems() != null) {
                for (CatalogueItem item : res.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("id", item.getId());
                    itemMap.put("nom", item.getNom());
                    itemMap.put("prix", item.getPrix() != null ? item.getPrix() : BigDecimal.ZERO);
                    itemMap.put("prixParPersonne", item.getPrixParPersonne() != null ? item.getPrixParPersonne() : BigDecimal.ZERO);
                    
                    // Convertir en String et minuscule pour matcher la DB (ziana, negafa, etc.)
                    String cat = (item.getCategorie() != null) ? String.valueOf(item.getCategorie()).toLowerCase() : ""; 

                    // Check avec les noms réels trouvés dans ta base de données
                    if (cat.contains("negafa") || cat.contains("ziana")) {
                        dto.setNegafa(itemMap);
                    } else if (cat.contains("traiteur")) {
                        dto.setTraiteur(itemMap);
                    } else if (cat.contains("photographe")) {
                        dto.setPhotographe(itemMap);
                    }
                    // Tu peux ajouter le DJ ici si tu as le champ dans ton DTO
                }
            }
            return dto;
        }).collect(Collectors.toList());
    }
}