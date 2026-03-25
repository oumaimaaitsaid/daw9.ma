export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  ville?: string;
  budget?: number;
  dateMarriage?: string;
  createdAt?: string;
  active?: boolean;
  nombreInvites?: number;
}

export interface ClientProfileUpdate {
  phone?: string;
  ville?: string;
  budget?: number;
  dateMarriage?: string;
}
