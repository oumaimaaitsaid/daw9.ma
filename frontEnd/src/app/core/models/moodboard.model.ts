export interface MoodboardImage {
  id: number;
  imageUrl: string;
  fileName: string;
  categorie: string;
  sousCategorie: string;
  confidence: number;
  analysisStatus: string;
  couleurDominante?: string;
  createdAt?: string;
}

export interface LocalUpload {
  id: number;
  url: string;
  file?: File;
}
