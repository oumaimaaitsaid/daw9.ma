package com.daw9.service;

import com.daw9.model.CatalogueItem;
import com.daw9.repository.CatalogueItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CatalogueServiceImpl implements CatalogueService {

    private final CatalogueItemRepository repository;

    @Override
    @Cacheable(value = "catalogue", key = "#pageable")
    public Page<CatalogueItem> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    @Cacheable(value = "catalogue_cat", key = "#categorie + '-' + #pageable")
    public Page<CatalogueItem> findByCategorie(String categorie, Pageable pageable) {
        return repository.findByCategorie(categorie, pageable);
    }

    @Override
    @Cacheable(value = "catalogue_scat", key = "#sousCategorie + '-' + #pageable")
    public Page<CatalogueItem> findBySousCategorie(String sousCategorie, Pageable pageable) {
        return repository.findBySousCategorie(sousCategorie, pageable);
    }

    @Override
    public Page<CatalogueItem> findByCategorieAndSousCategorie(String categorie, String sousCategorie, Pageable pageable) {
        return repository.findByCategorieAndSousCategorie(categorie, sousCategorie, pageable);
    }

    @Override
    public java.util.Optional<CatalogueItem> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Override
    public CatalogueItem save(CatalogueItem item) {
        return repository.save(item);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
