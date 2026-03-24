package com.daw9.model;

import com.daw9.model.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "demandes_reservation")
@Data
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class DemandeReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnoreProperties({ "reservations", "password", "handler", "hibernateLazyInitializer" })
    private Client client;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "reservation_items", joinColumns = @JoinColumn(name = "reservation_id"), inverseJoinColumns = @JoinColumn(name = "item_id"))
    private List<CatalogueItem> items = new ArrayList<>();

    @Column(name = "date_evenement")
    private LocalDate dateEvenement;

    @Column(name = "nombre_invites")
    private Integer nombreInvites;

    @Column(length = 1000)
    private String message;

    @Column(name = "montant_total")
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.EN_ATTENTE;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
