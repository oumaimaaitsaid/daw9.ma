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
}

export interface ClientProfileUpdate {
  phone?: string;
  ville?: string;
  budget?: number;
  dateMarriage?: string;
}
