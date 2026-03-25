package com.daw9.controller;

import com.daw9.model.Client;
import com.daw9.model.DemandeReservation;
import com.daw9.model.enums.ReservationStatus;
import com.daw9.model.enums.NotificationType;
import com.daw9.model.Notification;
import com.daw9.repository.ClientRepository;
import com.daw9.repository.DemandeReservationRepository;
import com.daw9.repository.CatalogueItemRepository;
import com.daw9.model.enums.NotificationType;
import com.daw9.service.NotificationService;
import com.daw9.service.DemandeReservationService;
import com.daw9.dto.ReservationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final ClientRepository clientRepository;
    private final DemandeReservationRepository demandeReservationRepository;
    private final CatalogueItemRepository catalogueItemRepository;
    private final NotificationService notificationService;
    private final DemandeReservationService demandeReservationService;

    // Dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.count());
        stats.put("totalArticles", catalogueItemRepository.count());
        stats.put("totalReservations", demandeReservationRepository.count());
        stats.put("reservationsEnAttente", demandeReservationRepository.countByStatus(ReservationStatus.EN_ATTENTE));
        return ResponseEntity.ok(stats);
    }

    // Client management
    @GetMapping("/clients")
    public ResponseEntity<Page<Client>> getClients(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(clientRepository.findAll(pageable));
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClient(@PathVariable("id") Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable("id") Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            log.info("Client {} supprimé par admin", id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/clients/{id}/toggle-status")
    public ResponseEntity<Client> toggleClientStatus(@PathVariable("id") Long id) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setActive(!client.isActive());
                    Client saved = clientRepository.save(client);

                    String statusText = saved.isActive() ? "RÉACTIVÉ" : "SUSPENDU";
                    notificationService.createNotification(
                            "🔒 Alerte Sécurité",
                            "Le compte de " + saved.getPrenom() + " " + saved.getNom() + " a été " + statusText
                                    + " par un administrateur.",
                            1L,
                            NotificationType.STATUS_CHANGE);

                    log.info("Client {} status set to active={}", id, saved.isActive());
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Reservations (demandes)
    @GetMapping("/reservations")
    public ResponseEntity<Page<ReservationResponseDTO>> getAllReservations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(demandeReservationService.getAllReservations(pageable));
    }

    @GetMapping("/reservations/stats")
    public ResponseEntity<Map<String, Object>> getReservationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", demandeReservationRepository.count());
        stats.put("enAttente", demandeReservationRepository.countByStatus(ReservationStatus.EN_ATTENTE));
        stats.put("confirmees", demandeReservationRepository.countByStatus(ReservationStatus.CONFIRMEE));
        stats.put("annulees", demandeReservationRepository.countByStatus(ReservationStatus.ANNULEE));
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/reservations/{id}/confirm")
    public ResponseEntity<DemandeReservation> confirmReservation(@PathVariable("id") Long id) {
        return demandeReservationRepository.findById(id)
                .map(demande -> {
                    demande.setStatus(ReservationStatus.CONFIRMEE);
                    DemandeReservation saved = demandeReservationRepository.save(demande);

                    Notification notif = Notification.createForClient(
                            demande.getClient(),
                            NotificationType.RESERVATION_CONFIRMEE,
                            "Réservation Confirmée",
                            "Bonne nouvelle ! Votre demande pour le " + demande.getDateEvenement() + " est confirmée.");

                    notificationService.sendNotification(demande.getClient().getId(), notif);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/reservations/{id}/cancel")
    public ResponseEntity<DemandeReservation> cancelReservation(@PathVariable("id") Long id) {
        return demandeReservationRepository.findById(id)
                .map(demande -> {
                    demande.setStatus(ReservationStatus.ANNULEE);
                    DemandeReservation saved = demandeReservationRepository.save(demande);

                    Notification notif = Notification.createForClient(
                            demande.getClient(),
                            NotificationType.RESERVATION_ANNULEE,
                            "Réservation Annulée",
                            "Désolé, votre demande pour le " + demande.getDateEvenement() + " a été annulée.");

                    notificationService.sendNotification(demande.getClient().getId(), notif);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}