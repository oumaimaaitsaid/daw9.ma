package com.daw9.controller;

import com.daw9.dto.CatalogueItemDTO;
import com.daw9.model.CatalogueItem;
import com.daw9.service.CatalogueService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping({ "/api/admin/catalogues", "/api/admin/catalogue" })
@RequiredArgsConstructor
@Slf4j
public class AdminCatalogueController {

    private final CatalogueService catalogueService;
    private final ObjectMapper objectMapper;
    private final com.daw9.mapper.CatalogueMapper catalogueMapper;

    private static final String UPLOAD_DIR = "uploads/catalogue/";

    @GetMapping("/{categorie}")
    public ResponseEntity<Page<CatalogueItemDTO>> getByCategorie(@PathVariable("categorie") String categorie, Pageable pageable) {
        log.info("Fetching items for category: {}", categorie);
        Page<CatalogueItem> items = catalogueService.findByCategorie(categorie, pageable);
        return ResponseEntity.ok(items.map(catalogueMapper::toDTO));
    }

    @GetMapping("/{categorie}/{sousCategorie}")
    public ResponseEntity<Page<CatalogueItemDTO>> getItems(
            @PathVariable("categorie") String categorie,
            @PathVariable("sousCategorie") String sousCategorie,
            Pageable pageable) {
        Page<CatalogueItem> items = catalogueService
                .findByCategorieAndSousCategorie(categorie, sousCategorie, pageable);
        return ResponseEntity.ok(items.map(catalogueMapper::toDTO));
    }

    @GetMapping("/{categorie}/{sousCategorie}/{id}")
    public ResponseEntity<CatalogueItemDTO> getItem(
            @PathVariable("categorie") String categorie,
            @PathVariable("sousCategorie") String sousCategorie,
            @PathVariable("id") Long id) {
        return catalogueService.findById(id)
                .map(catalogueMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{categorie}/{sousCategorie}")
    public ResponseEntity<CatalogueItem> createItem(
            @PathVariable("categorie") String categorie,
            @PathVariable("sousCategorie") String sousCategorie,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            CatalogueItem item = objectMapper.readValue(dataJson, CatalogueItem.class);
            item.setCategorie(categorie);
            item.setSousCategorie(sousCategorie);

            // Upload images
            if (images != null && !images.isEmpty()) {
                List<String> imagePaths = uploadImages(images, categorie, sousCategorie);
                if (item.getImages() == null) {
                    item.setImages(new ArrayList<>());
                }
                item.getImages().addAll(imagePaths);
            }

            CatalogueItem saved = catalogueService.save(item);
            log.info("Item créé: {} dans {}/{}", saved.getNom(), categorie, sousCategorie);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            log.error("CRITICAL: Erreur création item {}/{}", categorie, sousCategorie, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{categorie}/{sousCategorie}/{id}")
    public ResponseEntity<CatalogueItem> updateItem(
            @PathVariable("categorie") String categorie,
            @PathVariable("sousCategorie") String sousCategorie,
            @PathVariable("id") Long id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return catalogueService.findById(id)
                .map(existing -> {
                    try {
                        CatalogueItem updated = objectMapper.readValue(dataJson, CatalogueItem.class);
                        updated.setId(id);
                        updated.setCategorie(categorie);
                        updated.setSousCategorie(sousCategorie);

                        if (updated.getImages() == null) {
                            updated.setImages(new ArrayList<>());
                        }

                        if (images != null && !images.isEmpty()) {
                            List<String> imagePaths = uploadImages(images, categorie, sousCategorie);
                            updated.getImages().addAll(imagePaths);
                        }

                        CatalogueItem saved = catalogueService.save(updated);
                        log.info("Item modifié: {} (ID: {})", saved.getNom(), id);
                        return ResponseEntity.ok(saved);

                    } catch (Exception e) {
                        log.error("Erreur modification item", e);
                        return ResponseEntity.badRequest().<CatalogueItem>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{categorie}/{sousCategorie}/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable("categorie") String categorie,
            @PathVariable("sousCategorie") String sousCategorie,
            @PathVariable("id") Long id) {
        if (catalogueService.existsById(id)) {
            catalogueService.deleteById(id);
            log.info("Item supprimé: ID {} dans {}/{}", id, categorie, sousCategorie);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private List<String> uploadImages(List<MultipartFile> files, String categorie, String sousCategorie)
            throws IOException {
        List<String> paths = new ArrayList<>();
        Path uploadPath = Paths.get(UPLOAD_DIR + categorie + "/" + sousCategorie);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            if (file.isEmpty())
                continue;

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            paths.add("/" + UPLOAD_DIR + categorie + "/" + sousCategorie + "/" + filename);
        }

        return paths;
    }
}
