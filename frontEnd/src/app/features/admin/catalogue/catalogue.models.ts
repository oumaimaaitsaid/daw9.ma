export interface CatalogueItem {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  images: string[];
  sousCategorie: string;
  // Champs spécifiques selon le type
  type?: string; 
  couleurDominante?: string; 
  couleurs?: string[];
  tailles?: string[];
  matieres?: string[];
  styles?: string[];
  zone?: string;
  duree?: number;
  prixParPersonne?: number;
  capaciteMin?: number;
  capaciteMax?: number;
  styleProfile?: {
    style?: string;
    palette?: string;
    ambiance?: string;
    budgetPercu?: string;
  };
}
