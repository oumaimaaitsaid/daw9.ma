package com.daw9.repository;

import com.daw9.model.MoodboardImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoodboardImageRepository extends JpaRepository<MoodboardImage, Long> {
    List<MoodboardImage> findByClientId(Long clientId);
    Page<MoodboardImage> findByClientId(Long clientId, Pageable pageable);
    long countByClientId(Long clientId);
}
