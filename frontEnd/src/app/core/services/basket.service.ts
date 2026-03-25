import { Injectable, signal, computed, effect } from '@angular/core';

export interface CatalogueItem {
  id: number;
  nom: string;
  description: string;
  prix?: number;
  prixParPersonne?: number;
  images: any[];
  type: string;
  sousCategorie?: string;
  couleurDominante?: string;
  categoryKey?: string; // Stored for UI grouping if needed
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private readonly STORAGE_KEY = 'daw9_basket_selection_v2'; // New key for the array structure
  
  // Using signals for reactive state - now an array of items
  private itemsSignal = signal<CatalogueItem[]>([]);

  constructor() {
    // Load from localStorage on init
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.itemsSignal.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse basket from storage', e);
      }
    }

    // Persist to localStorage whenever state changes
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.itemsSignal()));
    });
  }

  // Getters
  items = computed(() => this.itemsSignal());
  
  itemCount = computed(() => this.items().length);

  isEmpty = computed(() => this.itemCount() === 0);

  // Actions
  addItem(item: CatalogueItem, type?: string) {
    // Prevent duplicates of the same item
    const exists = this.itemsSignal().some(i => i.id === item.id);
    if (exists) return;

    const categoryKey = type || item.sousCategorie || item.type || 'autre';
    const itemWithKey = { ...item, categoryKey };
    this.itemsSignal.update(items => [...items, itemWithKey]);
  }

  removeItem(index: number) {
    this.itemsSignal.update(items => {
      const newItems = [...items];
      newItems.splice(index, 1);
      return newItems;
    });
  }

  clear() {
    this.itemsSignal.set([]);
  }

  calculateTotal(guests: number = 100): number {
    return this.items().reduce((total, item) => {
      if (item.prixParPersonne) {
        return total + (item.prixParPersonne * guests);
      }
      return total + (item.prix || 0);
    }, 0);
  }

  // Helper to keep compatibility with parts of UI that expect a map (if any)
  selection() {
      const map: { [key: string]: CatalogueItem } = {};
      this.items().forEach(item => {
          if (item.categoryKey) map[item.categoryKey] = item;
      });
      return map;
  }
}
