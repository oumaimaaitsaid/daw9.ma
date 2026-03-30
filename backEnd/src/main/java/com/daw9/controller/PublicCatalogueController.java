package com.daw9.controller;

import com.daw9.dto.CatalogueItemDTO;
import com.daw9.model.CatalogueItem;
import com.daw9.service.CatalogueService;
import com.daw9.mapper.CatalogueMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/public/catalogues")
@RequiredArgsConstructor
@Slf4j
public class PublicCatalogueController {

    private final CatalogueService catalogueService;
    private final CatalogueMapper catalogueMapper;

    @GetMapping("/{categorie}")
    public ResponseEntity<Page<CatalogueItemDTO>> getByCategorie(@PathVariable("categorie") String categorie, Pageable pageable) {
        log.info("Public access: Fetching items for category: {}", categorie);
        Page<CatalogueItem> items = catalogueService.findByCategorie(categorie, pageable);
        return ResponseEntity.ok(items.map(catalogueMapper::toDTO));
    }

    @GetMapping("/{categorie}/{sousCategorie}")
    public ResponseEntity<Page<CatalogueItemDTO>> getItems(
            @PathVariable("categorie") String categorie,
            @PathVariable("sousCategorie") String sousCategorie,
            Pageable pageable) {
        log.info("Public access: Fetching items for category: {} and subcategory: {}", categorie, sousCategorie);
        Page<CatalogueItem> items = catalogueService
                .findByCategorieAndSousCategorie(categorie, sousCategorie, pageable);
        return ResponseEntity.ok(items.map(catalogueMapper::toDTO));
    }
}
