import { StyleProfile } from './style-profile.model';

export interface MoodboardImage {
  id: number;
  imageUrl: string;
  fileName: string;
  categorie: string;
  sousCategorie: string;
  confidence: number;
  analysisStatus: string;
  couleurDominante?: string;
  styleProfile?: StyleProfile;
  createdAt?: string;
}

export interface LocalUpload {
  id: number;
  url: string;
  file?: File;
}
