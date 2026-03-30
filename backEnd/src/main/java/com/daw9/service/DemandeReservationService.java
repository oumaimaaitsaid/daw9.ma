package com.daw9.service;

import com.daw9.dto.ReservationResponseDTO;
import com.daw9.model.DemandeReservation;
import com.daw9.repository.DemandeReservationRepository;
import com.daw9.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DemandeReservationService {

    private final DemandeReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getClientReservations(Long clientId, Pageable pageable) {
        Page<DemandeReservation> reservations = reservationRepository.findByClientId(clientId, pageable);
        return reservations.map(reservationMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponseDTO> getAllReservations(Pageable pageable) {
        Page<DemandeReservation> reservations = reservationRepository.findAll(pageable);
        return reservations.map(reservationMapper::toDTO);
    }
}
