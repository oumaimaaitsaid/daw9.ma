package com.daw9.controller;

import com.daw9.dto.ClientProfileDTO;
import com.daw9.dto.ReservationResponseDTO;
import com.daw9.model.*;
import com.daw9.repository.*;
import com.daw9.service.FileStorageService;
import com.daw9.service.MoodboardProcessingService;
import com.daw9.service.CatalogueMatchingService;
import com.daw9.service.CatalogueService;
import com.daw9.service.DemandeReservationService;
import com.daw9.service.NotificationService;
import com.daw9.model.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Client Portal", description = "Endpoints réservés aux clients connectés")
@SecurityRequirement(name = "Bearer Authentication")
public class ClientController {

    private final ClientRepository clientRepository;
    private final MoodboardImageRepository moodboardImageRepository;
    private final DemandeReservationRepository demandeReservationRepository;
    private final FileStorageService fileStorageService;
    private final MoodboardProcessingService processingService;
    private final CatalogueMatchingService catalogueMatchingService;
    private final CatalogueService catalogueService;
    private final DemandeReservationService demandeReservationService;
    private final NotificationService notificationService;

    @Operation(summary = "Récupérer le profil client", description = "Retourne les informations du client connecté à partir du token JWT")
    @GetMapping("/profile")
    public ResponseEntity<ClientProfileDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Client client = clientRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client non trouvé"));
        return ResponseEntity.ok(ClientProfileDTO.fromEntity(client));
    }

    @PutMapping("/profile")
    public ResponseEntity<ClientProfileDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Client updateRequest) {
        Client client = clientRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client non trouvé"));

        if (updateRequest.getPhone() != null)
            client.setPhone(updateRequest.getPhone());
        if (updateRequest.getVille() != null)
            client.setVille(updateRequest.getVille());
        if (updateRequest.getBudget() != null)
            client.setBudget(updateRequest.getBudget());
        if (updateRequest.getDateMarriage() != null)
            client.setDateMarriage(updateRequest.getDateMarriage());

        Client saved = clientRepository.save(client);
        return ResponseEntity.ok(ClientProfileDTO.fromEntity(saved));
    }

    // ---- Moodboard ----

    @GetMapping("/moodboard")
    public ResponseEntity<Page<MoodboardImage>> getMoodboard(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Client client = getClient(userDetails);
        return ResponseEntity.ok(moodboardImageRepository.findByClientId(client.getId(), pageable));
    }

    @PostMapping("/moodboard/upload")
    public ResponseEntity<MoodboardImage> uploadMoodboardImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        Client client = getClient(userDetails);
        MoodboardImage saved = persistImage(file, client);
        fireAnalysis(saved, file, client);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Upload en masse d'images", description = "Enregistre plusieurs images pour le moodboard et lance l'analyse IA asynchrone")
    @PostMapping("/moodboard/upload-bulk")
    public ResponseEntity<List<MoodboardImage>> uploadBulk(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("files") MultipartFile[] files) {

        Client client = getClient(userDetails);
        List<MoodboardImage> saved = new ArrayList<>();

        for (MultipartFile file : files) {
            MoodboardImage img = persistImage(file, client);
            saved.add(img);
            fireAnalysis(img, file, client);
        }

        log.info("Bulk upload: {} images saved for client {}", saved.size(), client.getId());
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/moodboard/{imageId}")
    public ResponseEntity<Void> deleteMoodboardImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("imageId") Long imageId) {

        Client client = getClient(userDetails);
        MoodboardImage image = moodboardImageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image non trouvée"));

        if (!image.getClient().getId().equals(client.getId())) {
            return ResponseEntity.status(403).build();
        }

        fileStorageService.deleteFile(image.getImageUrl());
        moodboardImageRepository.delete(image);
        return ResponseEntity.ok().build();
    }

    // ---- Suggestions & Catalogue ----

    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSuggestions(@AuthenticationPrincipal UserDetails userDetails) {
        Client client = getClient(userDetails);
        return ResponseEntity.ok(catalogueMatchingService.getSuggestions(client.getId()));
    }

    @GetMapping("/catalogue")
    public ResponseEntity<Page<CatalogueItem>> getAllCatalogue(Pageable pageable) {
        return ResponseEntity.ok(catalogueService.findAll(pageable));
    }

    @GetMapping("/catalogue/{categorie}")
    public ResponseEntity<Page<CatalogueItem>> getCatalogueByCategorie(
            @PathVariable("categorie") String categorie, Pageable pageable) {
        return ResponseEntity.ok(catalogueService.findByCategorie(categorie, pageable));
    }

    @GetMapping("/catalogue/{categorie}/{sousCategorie}")
    public ResponseEntity<Page<CatalogueItem>> getCatalogueBySousCategorie(
            @PathVariable("categorie") String categorie, @PathVariable("sousCategorie") String sousCategorie,
            Pageable pageable) {
        return ResponseEntity.ok(catalogueService.findByCategorieAndSousCategorie(categorie, sousCategorie, pageable));
    }

    // ---- Reservations ----

    @Operation(summary = "Créer une réservation", description = "Enregistre une nouvelle demande de réservation avec sélection d'articles")
    @PostMapping("/reservations")
    public ResponseEntity<DemandeReservation> createReservation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReservationRequest request) {

        Client client = getClient(userDetails);

        DemandeReservation demande = new DemandeReservation();
        demande.setClient(client);
        demande.setDateEvenement(request.dateEvenement());
        demande.setNombreInvites(request.nombreInvites());
        demande.setMessage(request.message());
        demande.setVille(request.ville());

        BigDecimal total = BigDecimal.ZERO;
        List<CatalogueItem> items = new ArrayList<>();

        if (request.itemIds() != null) {
            for (Long itemId : request.itemIds()) {
                CatalogueItem item = catalogueService.findById(itemId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Article non trouvé: " + itemId));
                items.add(item);
                if (item.getPrixParPersonne() != null && request.nombreInvites() != null) {
                    total = total.add(item.getPrixParPersonne().multiply(BigDecimal.valueOf(request.nombreInvites())));
                } else if (item.getPrix() != null) {
                    total = total.add(item.getPrix());
                }
            }
        }

        demande.setItems(items);
        demande.setMontantTotal(total);

        DemandeReservation saved = demandeReservationRepository.save(demande);
        log.info("Reservation {} créée pour client {} ({} articles)", saved.getId(), client.getId(), items.size());

        String clientName = (client.getPrenom() != null ? client.getPrenom() : "") + " " +
                (client.getNom() != null ? client.getNom() : "");
        notificationService.createNotification(
                "✨ Nouvelle Réservation",
                "Le client " + clientName.trim() + " a créé une nouvelle demande de réservation (#" + saved.getId()
                        + ").",
                1L,
                NotificationType.NOUVELLE_RESERVATION);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/reservations")
    public ResponseEntity<Page<ReservationResponseDTO>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Client client = getClient(userDetails);
        return ResponseEntity.ok(demandeReservationService.getClientReservations(client.getId(), pageable));
    }

    private Client getClient(UserDetails userDetails) {
        return clientRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client non trouvé"));
    }

    private MoodboardImage persistImage(MultipartFile file, Client client) {
        String url = fileStorageService.storeFile(file, "moodboard/" + client.getId());
        MoodboardImage img = new MoodboardImage();
        img.setClient(client);
        img.setImageUrl(url);
        img.setFileName(file.getOriginalFilename());
        img.setAnalysisStatus("PENDING");
        return moodboardImageRepository.save(img);
    }

    private void fireAnalysis(MoodboardImage img, MultipartFile file, Client client) {
        try {
            byte[] data = file.getBytes();
            processingService.analyzeAsync(img.getId(), data, client.getId());
        } catch (Exception e) {
            log.error("Could not read file bytes for image {}: {}", img.getId(), e.getMessage());
        }
    }

    public record ReservationRequest(
            List<Long> itemIds,
            @NotNull(message = "La date d'événement est obligatoire") LocalDate dateEvenement,
            @NotNull(message = "Le nombre d'invités est obligatoire") Integer nombreInvites,
            String ville,
            String message) {
    }
}
