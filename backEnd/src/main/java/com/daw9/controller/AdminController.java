package com.daw9.controller;

import com.daw9.model.Client;
import com.daw9.model.DemandeReservation;
import com.daw9.model.enums.ReservationStatus;
import com.daw9.model.enums.NotificationType;
import com.daw9.model.Notification;
import com.daw9.repository.ClientRepository;
import com.daw9.repository.DemandeReservationRepository;
import com.daw9.repository.CatalogueItemRepository;
import com.daw9.service.NotificationService;
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
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final ClientRepository clientRepository;
    private final DemandeReservationRepository demandeReservationRepository;
    private final CatalogueItemRepository catalogueItemRepository;
    private final NotificationService notificationService;

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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(clientRepository.findAll(pageable));
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClient(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            log.info("Client {} supprimé par admin", id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Reservations (demandes)
    @GetMapping("/reservations")
    public ResponseEntity<Page<DemandeReservation>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(demandeReservationRepository.findAll(pageable));
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
    public ResponseEntity<DemandeReservation> confirmReservation(@PathVariable Long id) {
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
    public ResponseEntity<DemandeReservation> cancelReservation(@PathVariable Long id) {
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