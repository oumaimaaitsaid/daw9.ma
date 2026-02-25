package com.daw9.service;

import com.daw9.model.CatalogueItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CatalogueService {
    Page<CatalogueItem> findAll(Pageable pageable);
    Page<CatalogueItem> findByCategorie(String categorie, Pageable pageable);
    Page<CatalogueItem> findBySousCategorie(String sousCategorie, Pageable pageable);
    Page<CatalogueItem> findByCategorieAndSousCategorie(String categorie, String sousCategorie, Pageable pageable);
    java.util.Optional<CatalogueItem> findById(Long id);
    boolean existsById(Long id);
    CatalogueItem save(CatalogueItem item);
    void deleteById(Long id);
}
