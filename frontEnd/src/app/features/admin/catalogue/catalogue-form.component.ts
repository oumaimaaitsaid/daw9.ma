import { Component, Input, Output, EventEmitter, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogueItem } from './catalogue.models';
import { 
  TYPE_OPTIONS, 
  FIELDS_CONFIG, 
  STYLE_OPTIONS, 
  PALETTE_OPTIONS, 
  AMBIANCE_OPTIONS, 
  BUDGET_OPTIONS, 
  COULEUR_OPTIONS, 
  TENUES_SOUS_CATEGORIES 
} from './catalogue.constants';

@Component({
  selector: 'app-catalogue-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogue-form.component.html',
  styles: [`
    :host { display: block; }
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .shadow-luxury { box-shadow: 0 40px 100px -20px rgba(26, 26, 26, 0.15), 0 0 40px rgba(212, 175, 55, 0.05); }
    .shadow-premium { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03); }
  `]
})
export class CatalogueFormComponent {
  @Input({ required: true }) showForm!: Signal<boolean>;
  @Input({ required: true }) isEdit!: Signal<boolean>;
  @Input({ required: true }) saving!: Signal<boolean>;
  @Input({ required: true }) currentItem!: WritableSignal<CatalogueItem>;
  @Input({ required: true }) sousCategorie!: Signal<string>;
  @Input({ required: true }) serverUrl: string = '';

  @Input() couleursStr = '';
  @Input() taillesStr = '';
  @Input() matieresStr = '';
  @Input() stylesStr = '';
  @Input() styleProfileStyle = '';
  @Input() styleProfilePalette = '';
  @Input() styleProfileAmbiance = '';
  @Input() styleProfileBudget = '';

  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<{ item: CatalogueItem, files: File[] }>();
  @Output() onFiles = new EventEmitter<File[]>();

  styleOptions = STYLE_OPTIONS;
  paletteOptions = PALETTE_OPTIONS;
  ambianceOptions = AMBIANCE_OPTIONS;
  budgetOptions = BUDGET_OPTIONS;
  couleurOptions = COULEUR_OPTIONS;

  files: File[] = [];

  hasField(field: string): boolean {
    const config = FIELDS_CONFIG[this.sousCategorie()];
    return config?.fields.includes(field) || false;
  }

  getFieldLabel(field: string): string {
    const config = FIELDS_CONFIG[this.sousCategorie()];
    return config?.labels[field] || field;
  }

  getTypeOptions(): { value: string, label: string }[] {
    return TYPE_OPTIONS[this.sousCategorie()] || [];
  }

  isTenue(): boolean {
    return TENUES_SOUS_CATEGORIES.includes(this.sousCategorie());
  }

  handleFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
      this.onFiles.emit(this.files);
    }
  }

  submit() {
    const item = this.currentItem();
    item.couleurs = this.couleursStr.split(',').map(s => s.trim()).filter(s => s);
    item.tailles = this.taillesStr.split(',').map(s => s.trim()).filter(s => s);
    item.matieres = this.matieresStr.split(',').map(s => s.trim()).filter(s => s);
    item.styles = this.stylesStr.split(',').map(s => s.trim()).filter(s => s);
    
    if (this.isTenue()) {
      item.styleProfile = {
        style: this.styleProfileStyle || undefined,
        palette: this.styleProfilePalette || undefined,
        ambiance: this.styleProfileAmbiance || undefined,
        budgetPercu: this.styleProfileBudget || undefined
      };
    }

    this.onSave.emit({ item, files: this.files });
  }
}
