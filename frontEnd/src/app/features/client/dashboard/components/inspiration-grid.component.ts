import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodboardImage, LocalUpload } from '../../../../core/models/moodboard.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-inspiration-grid',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './inspiration-grid.component.html',
  styles: [`
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .scroll-hidden { -ms-overflow-style: none; scrollbar-width: none; }
    .shadow-premium { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03); }
    .reveal { animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspirationGridComponent {
  @Input() moodboard: MoodboardImage[] = [];
  @Input() localUploads: LocalUpload[] = [];
  @Output() onZoom = new EventEmitter<MoodboardImage>();
  @Output() onDelete = new EventEmitter<number>();

  getImagesByCategorie(cat: string | null): MoodboardImage[] {
    if (cat === null) return this.moodboard.filter(img => !img.categorie);
    return this.moodboard.filter(img => img.categorie === cat);
  }

  formatSousCategorie(sousCategorie: string): string {
    const labels: { [key: string]: string } = {
      'caftan': 'Caftan', 'takchita': 'Takchita', 'lebsa': 'Lebsa',
      'ROBE_MODERNE': 'Robe Moderne', 'JABADOR': 'Jabador', 'BIJOUX': 'Bijoux', 'AMARIYA': 'Amariya',
      'robe-moderne': 'Robe Moderne', 'jabador': 'Jabador', 'costume': 'Costume',
      'maquillage': 'Maquillage', 'coiffure': 'Coiffure', 'henne': 'Henné',
      'ziana': 'Ziana', 'entrees': 'Entrées',
      'plats-principaux': 'Plats Principaux', 'PATISSERIES': 'Pâtisseries', 'gateau-mariage': 'Gâteau de Mariage'
    };
    return labels[sousCategorie] || sousCategorie;
  }

  getCouleurCode(couleur: string): string {
    const couleurs: { [key: string]: string } = {
      'blanc': '#FFFFFF', 'noir': '#000000', 'rouge': '#DC2626', 'bleu': '#2563EB',
      'vert': '#16A34A', 'rose': '#EC4899', 'dore': '#D4AF37', 'argent': '#C0C0C0',
      'beige': '#F5F5DC', 'bordeaux': '#800020', 'prune': '#8E4585', 'gris': '#6B7280',
      'creme': '#FFFDD0', 'violet': '#7C3AED', 'orange': '#EA580C'
    };
    return couleurs[couleur?.toLowerCase()] || '#9CA3AF';
  }
}
