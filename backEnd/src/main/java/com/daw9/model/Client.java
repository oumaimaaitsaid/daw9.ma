package com.daw9.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Client extends User {

    private BigDecimal budget;

    @Column(name = "date_mariage")
    private LocalDate dateMarriage;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "style", column = @Column(name = "style_profile_style")),
        @AttributeOverride(name = "palette", column = @Column(name = "style_profile_palette")),
        @AttributeOverride(name = "ambiance", column = @Column(name = "style_profile_ambiance")),
        @AttributeOverride(name = "budgetPercu", column = @Column(name = "style_profile_budget"))
    })
    private StyleProfile styleProfile;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MoodboardImage> moodboard = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DemandeReservation> reservations = new ArrayList<>();
}
