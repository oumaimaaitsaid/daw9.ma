package com.daw9.repository;

import com.daw9.model.DemandeReservation;
import com.daw9.model.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeReservationRepository extends JpaRepository<DemandeReservation, Long> {
    List<DemandeReservation> findByClientId(Long clientId);
    Page<DemandeReservation> findByClientId(Long clientId, Pageable pageable);
    List<DemandeReservation> findByStatus(ReservationStatus status);
    Page<DemandeReservation> findByStatus(ReservationStatus status, Pageable pageable);
    long countByStatus(ReservationStatus status);
}
