package com.daw9.service;

import com.daw9.dto.ReservationResponseDTO;
import com.daw9.model.CatalogueItem;
import com.daw9.model.DemandeReservation;
import com.daw9.repository.DemandeReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DemandeReservationService {

    private final DemandeReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getClientReservations(Long clientId, Pageable pageable) {
        Page<DemandeReservation> reservations = reservationRepository.findByClientId(clientId, pageable);
        return reservations.map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getAllReservations(Pageable pageable) {
        Page<DemandeReservation> reservations = reservationRepository.findAll(pageable);
        return reservations.map(this::convertToDTO);
    }

    private ReservationResponseDTO convertToDTO(DemandeReservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(reservation.getId());
        dto.setDateEvenement(reservation.getDateEvenement());
        dto.setNombreInvites(reservation.getNombreInvites());
        dto.setMontantTotal(reservation.getMontantTotal());
        dto.setStatus(reservation.getStatus().name());
        dto.setVille(reservation.getVille());
        dto.setMessage(reservation.getMessage());

        if (reservation.getClient() != null) {
            dto.setClient(Map.of(
                    "id", reservation.getClient().getId(),
                    "prenom", reservation.getClient().getPrenom() != null ? reservation.getClient().getPrenom() : "",
                    "nom", reservation.getClient().getNom() != null ? reservation.getClient().getNom() : "",
                    "email", reservation.getClient().getEmail() != null ? reservation.getClient().getEmail() : ""));
        }

        List<Map<String, Object>> itemsList = new ArrayList<>();
        if (reservation.getItems() != null) {
            for (CatalogueItem item : reservation.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("nom", item.getNom());
                itemMap.put("prix", item.getPrix() != null ? item.getPrix() : BigDecimal.ZERO);
                itemMap.put("prixParPersonne",
                        item.getPrixParPersonne() != null ? item.getPrixParPersonne() : BigDecimal.ZERO);
                itemMap.put("categorie", item.getCategorie());
                itemMap.put("type", item.getType());

                List<Map<String, String>> imageMaps = new ArrayList<>();
                if (item.getImages() != null) {
                    for (String img : item.getImages()) {
                        Map<String, String> imgMap = new HashMap<>();
                        imgMap.put("url", img);
                        imageMaps.add(imgMap);
                    }
                }
                itemMap.put("images", imageMaps);

                itemsList.add(itemMap);
            }
        }
        dto.setItems(itemsList);
        return dto;
    }
}
