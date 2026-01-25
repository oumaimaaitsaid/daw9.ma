import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CatalogueNegafa {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  styles: string[];
  tenues: string[];
  services: string[];
  zone: string;
  images: string[];
}

export interface CatalogueTraiteur {
  id?: number;
  nom: string;
  description: string;
  prixParPersonne: number;
  typeCuisine: string;
  capaciteMin: number;
  capaciteMax: number;
  options: string[];
  zone: string;
  images: string[];
}

export interface CataloguePhotographe {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  stylePhoto: string;
  equipements: string[];
  livrables: string[];
  zone: string;
  images: string[];
}

@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/catalogues`;

  // --- NOUVELLES MÉTHODES GÉNÉRIQUES POUR CATALOGUE-ITEM ---
  getPublicItems(categorie: string, sousCategorie?: string): Observable<any> {
    const url = sousCategorie ? `${environment.apiUrl}/public/catalogues/${categorie}/${sousCategorie}` : `${environment.apiUrl}/public/catalogues/${categorie}`;
    return this.http.get<any>(url);
  }

  getItems(categorie: string, sousCategorie: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${categorie}/${sousCategorie}`);
  }

  saveItem(categorie: string, sousCategorie: string, data: any, files?: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    
    if (files && files.length > 0) {
      files.forEach(f => formData.append('images', f));
    }
    
    // Si l'item a un id, on fait un PUT ou POST selon le backend. 
    // Ici le controller original utilisait POST pour save (create/update géré par Spring Data save)
    return this.http.post<any>(`${this.baseUrl}/${categorie}/${sousCategorie}`, formData);
  }

  deleteItem(categorie: string, sousCategorie: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${categorie}/${sousCategorie}/${id}`);
  }

  // --- MÉTHODES EXISTANTES (Conservées pour la rétrocompatibilité) ---
  
  // Negafa
  getNegafas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/negafa`);
  }

  getNegafa(id: number): Observable<CatalogueNegafa> {
    return this.http.get<CatalogueNegafa>(`${this.baseUrl}/negafa/${id}`);
  }

  saveNegafa(data: CatalogueNegafa, files?: File[]): Observable<CatalogueNegafa> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (files) {
      files.forEach(f => formData.append('images', f));
    }
    if (data.id) {
      return this.http.put<CatalogueNegafa>(`${this.baseUrl}/negafa/${data.id}`, formData);
    }
    return this.http.post<CatalogueNegafa>(`${this.baseUrl}/negafa`, formData);
  }

  deleteNegafa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/negafa/${id}`);
  }

  // Traiteur
  getTraiteurs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/traiteur`);
  }

  getTraiteur(id: number): Observable<CatalogueTraiteur> {
    return this.http.get<CatalogueTraiteur>(`${this.baseUrl}/traiteur/${id}`);
  }

  saveTraiteur(data: CatalogueTraiteur, files?: File[]): Observable<CatalogueTraiteur> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (files) {
      files.forEach(f => formData.append('images', f));
    }
    if (data.id) {
      return this.http.put<CatalogueTraiteur>(`${this.baseUrl}/traiteur/${data.id}`, formData);
    }
    return this.http.post<CatalogueTraiteur>(`${this.baseUrl}/traiteur`, formData);
  }

  deleteTraiteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/traiteur/${id}`);
  }

  // Photographe
  getPhotographes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/photographe`);
  }

  getPhotographe(id: number): Observable<CataloguePhotographe> {
    return this.http.get<CataloguePhotographe>(`${this.baseUrl}/photographe/${id}`);
  }

  savePhotographe(data: CataloguePhotographe, files?: File[]): Observable<CataloguePhotographe> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (files) {
      files.forEach(f => formData.append('images', f));
    }
    if (data.id) {
      return this.http.put<CataloguePhotographe>(`${this.baseUrl}/photographe/${data.id}`, formData);
    }
    return this.http.post<CataloguePhotographe>(`${this.baseUrl}/photographe`, formData);
  }

  deletePhotographe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/photographe/${id}`);
  }
}
