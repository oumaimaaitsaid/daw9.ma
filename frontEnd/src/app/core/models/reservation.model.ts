export interface ReservationItem {
  id: number;
  nom: string;
  prix?: number;
  prixParPersonne?: number;
  categorie: string;
  type?: string;
}

export interface DemandeReservation {
  id: number;
  client: { id: number; nom: string; prenom: string; email: string };
  items: ReservationItem[];
  dateEvenement: string;
  nombreInvites: number;
  message: string;
  montantTotal: number;
  status: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | string;
  createdAt: string;
}

export interface ReservationStats {
  total: number;
  enAttente: number;
  confirmees: number;
  annulees: number;
}
