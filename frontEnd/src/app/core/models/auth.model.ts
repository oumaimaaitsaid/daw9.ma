export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  
  userId: number;
  token: string;
  role: string;
  email: string;
  nom: string;
  prenom: string;
}

export interface RegisterClientRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone?: string;
  ville?: string;
  budget?: number;
  dateMarriage?: string;
}

export interface RegisterPrestataireRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone?: string;
  ville?: string;
  nomEntreprise: string;
  description?: string;
  tarifMin?: number;
  tarifMax?: number;
  categorie: string;
}
