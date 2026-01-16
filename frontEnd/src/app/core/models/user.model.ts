export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  phone?: string;
  ville?: string;
  role: Role;
  createdAt?: Date;
}

export enum Role {
  CLIENT = 'CLIENT',
  PRESTATAIRE = 'PRESTATAIRE',
  ADMIN = 'ADMIN'
}

export interface Client extends User {
  budget?: number;
  dateMarriage?: Date;
  styleProfile?: StyleProfile;
}

export interface Prestataire extends User {
  nomEntreprise: string;
  description?: string;
  tarifMin?: number;
  tarifMax?: number;
  categorie: CategoriePrestataire;
  valide: boolean;
  styleProfile?: StyleProfile;
  photoCouverture?: string;
}

export enum CategoriePrestataire {
  NEGAFA = 'NEGAFA',
  TRAITEUR = 'TRAITEUR',
  PHOTOGRAPHE = 'PHOTOGRAPHE'
}

export interface StyleProfile {
  style?: StyleType;
  palette?: PaletteType;
  ambiance?: AmbianceType;
  budgetPercu?: BudgetType;
}

export enum StyleType {
  TRADITIONNEL = 'TRADITIONNEL',
  MODERNE = 'MODERNE',
  FUSION = 'FUSION'
}

export enum PaletteType {
  COLORE = 'COLORE',
  SOBRE = 'SOBRE',
  DORE_LUXE = 'DORE_LUXE'
}

export enum AmbianceType {
  ROMANTIQUE = 'ROMANTIQUE',
  FESTIF = 'FESTIF',
  ELEGANT = 'ELEGANT',
  BOHEME = 'BOHEME'
}

export enum BudgetType {
  ECONOMIQUE = 'ECONOMIQUE',
  MOYEN = 'MOYEN',
  PREMIUM = 'PREMIUM',
  LUXE = 'LUXE'
}
