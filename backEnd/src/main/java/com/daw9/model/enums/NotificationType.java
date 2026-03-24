package com.daw9.model.enums;

public enum NotificationType {
    // Client
    NOUVEAU_PRESTATAIRE_COMPATIBLE,
    RESERVATION_CONFIRMEE,
    RESERVATION_ANNULEE,

    // Prestataire
    NOUVEAU_CLIENT_COMPATIBLE,
    PAIEMENT_RECU,

    // Admin
    PRESTATAIRE_A_VALIDER,
    LITIGE_SIGNALE,
    STATUS_CHANGE,
    NOUVELLE_RESERVATION
}
