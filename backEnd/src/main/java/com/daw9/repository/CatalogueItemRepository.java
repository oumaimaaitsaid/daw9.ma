package com.daw9.repository;

import com.daw9.model.CatalogueItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CatalogueItemRepository extends JpaRepository<CatalogueItem, Long> {

    @EntityGraph(attributePaths = {"images", "couleurs", "tailles", "matieres", "styles"})
    Page<CatalogueItem> findBySousCategorie(String sousCategorie, Pageable pageable);

    @EntityGraph(attributePaths = {"images", "couleurs", "tailles", "matieres", "styles"})
    Page<CatalogueItem> findByCategorie(String categorie, Pageable pageable);

    @EntityGraph(attributePaths = {"images", "couleurs", "tailles", "matieres", "styles"})
    Page<CatalogueItem> findByCategorieAndSousCategorie(String categorie, String sousCategorie, Pageable pageable);

    @EntityGraph(attributePaths = {"images", "couleurs", "tailles", "matieres", "styles"})
    @Override
    Page<CatalogueItem> findAll(Pageable pageable);
}
