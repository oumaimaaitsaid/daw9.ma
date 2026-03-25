import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { environment } from '../../../../environments/environment';
import { CatalogueItem } from './catalogue.models';
import { 
  CATEGORY_MAP, 
  LABELS 
} from './catalogue.constants';
import { CatalogueTableComponent } from './catalogue-table.component';
import { CatalogueFormComponent } from './catalogue-form.component';

@Component({
  selector: 'app-catalogue-item',
  standalone: true,
  imports: [CommonModule, FormsModule, CatalogueTableComponent, CatalogueFormComponent],
  templateUrl: './catalogue-item.component.html',
  styles: [`
    :host { display: block; }
    .reveal-up { animation: revealUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-luxury { box-shadow: 0 40px 100px -20px rgba(26, 26, 26, 0.15), 0 0 40px rgba(212, 175, 55, 0.05); }
  `]
})
export class CatalogueItemComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogueService = inject(CatalogueService);

  serverUrl = environment.serverUrl;
  
  // Signals State
  sousCategorie = signal('');
  categorie = signal('');
  label = computed(() => LABELS[this.sousCategorie()] || this.sousCategorie());

  items = signal<CatalogueItem[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  
  filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const allItems = this.items();
    if (!q) return allItems;
    return allItems.filter(item => 
      item.nom.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q)
    );
  });

  successMessage = signal('');
  errorMessage = signal('');

  showForm = signal(false);
  isEdit = signal(false);
  saving = signal(false);
  currentItem = signal<CatalogueItem>(this.createEmptyItem());
  confirmingDelete = signal<CatalogueItem | null>(null);
  
  files: File[] = [];

  // Form Fields State (Used as inputs for the form component)
  couleursStr = '';
  taillesStr = '';
  matieresStr = '';
  stylesStr = '';
  styleProfileStyle = '';
  styleProfilePalette = '';
  styleProfileAmbiance = '';
  styleProfileBudget = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const paramSub = params.get('sousCategorie');
      const dataSub = this.route.snapshot.data['sousCategorie'];
      const sub = paramSub || dataSub;
      
      this.sousCategorie.set(sub);
      this.categorie.set(CATEGORY_MAP[sub] || 'negafa');
      this.loadItems();
    });
  }

  createEmptyItem(): CatalogueItem {
    return {
      nom: '', description: '', prix: 0, images: [],
      categorie: this.categorie(),
      sousCategorie: this.sousCategorie(),
      couleurs: [], tailles: [], matieres: [], styles: []
    };
  }

  loadItems() {
    this.loading.set(true);
    this.catalogueService.getItems(this.categorie(), this.sousCategorie()).subscribe({
      next: (res: any) => {
        this.items.set(res.content || []);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
      }
    });
  }

  showToast(message: string, isError = false) {
    if (isError) {
      this.errorMessage.set(message);
      setTimeout(() => this.errorMessage.set(''), 5000);
    } else {
      this.successMessage.set(message);
      setTimeout(() => this.successMessage.set(''), 5000);
    }
  }

  openForm() {
    this.isEdit.set(false);
    this.currentItem.set(this.createEmptyItem());
    this.resetFormStrings();
    this.showForm.set(true);
  }

  edit(item: CatalogueItem) {
    this.isEdit.set(true);
    this.currentItem.set({ ...item });
    this.populateFormStrings(item);
    this.showForm.set(true);
  }

  private resetFormStrings() {
    this.couleursStr = '';
    this.taillesStr = '';
    this.matieresStr = '';
    this.stylesStr = '';
    this.styleProfileStyle = '';
    this.styleProfilePalette = '';
    this.styleProfileAmbiance = '';
    this.styleProfileBudget = '';
    this.files = [];
  }

  private populateFormStrings(item: CatalogueItem) {
    this.couleursStr = item.couleurs?.join(', ') || '';
    this.taillesStr = item.tailles?.join(', ') || '';
    this.matieresStr = item.matieres?.join(', ') || '';
    this.stylesStr = item.styles?.join(', ') || '';
    this.styleProfileStyle = item.styleProfile?.style || '';
    this.styleProfilePalette = item.styleProfile?.palette || '';
    this.styleProfileAmbiance = item.styleProfile?.ambiance || '';
    this.styleProfileBudget = item.styleProfile?.budgetPercu || '';
    this.files = [];
  }

  closeForm() {
    this.showForm.set(false);
  }

  save(event: { item: CatalogueItem, files: File[] }) {
    this.saving.set(true);
    this.catalogueService.saveItem(this.categorie(), this.sousCategorie(), event.item, event.files).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.showToast(this.isEdit() ? 'Pièce mise à jour avec succès' : 'Nouvelle pièce inscrite au registre');
        this.loadItems();
      },
      error: err => {
        this.saving.set(false);
        this.showToast(err.error?.message || err.message, true);
      }
    });
  }

  delete(item: CatalogueItem) {
    this.confirmingDelete.set(item);
  }

  confirmDelete() {
    const item = this.confirmingDelete();
    if (!item || !item.id) return;

    this.catalogueService.deleteItem(this.categorie(), this.sousCategorie(), item.id).subscribe({
      next: () => {
        this.showToast('La pièce a été retirée du catalogue');
        this.confirmingDelete.set(null);
        this.loadItems();
      },
      error: err => {
        const errorMsg = err.error?.message || err.message || 'Une erreur est survenue lors de la suppression';
        this.showToast(errorMsg, true);
        this.confirmingDelete.set(null);
      }
    });
  }

  cancelDelete() {
    this.confirmingDelete.set(null);
  }
}
