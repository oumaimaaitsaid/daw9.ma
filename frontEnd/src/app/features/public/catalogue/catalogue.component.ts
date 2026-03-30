import { Component, inject, OnInit, ChangeDetectorRef, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/services/auth.service';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { CatalogueItem } from '../../../core/services/basket.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-public-catalogue',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, SkeletonComponent],
  templateUrl: './catalogue.component.html',
  styles: [`
    :host { display: block; height: 100vh; }
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .scroll-hidden { -ms-overflow-style: none; scrollbar-width: none; }
    .shadow-premium { box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05); }
    .shadow-luxury { box-shadow: 0 30px 60px -15px rgba(26, 26, 26, 0.1), 0 0 20px rgba(212, 175, 55, 0.05); }
    .reveal { animation: reveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .nav-item { @apply w-full text-left px-4 py-2 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest; }
    .nav-item-active { @apply w-full text-left px-4 py-2 text-[11px] font-black text-secondary border-l-2 border-primary uppercase tracking-widest bg-primary/5; }
  `]
})
export class PublicCatalogueComponent implements OnInit {
  private authService = inject(AuthService);
  private catalogueService = inject(CatalogueService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  catalogueItems: CatalogueItem[] = [];
  loadingCatalogue = false;
  sortBy = signal<'asc' | 'desc' | 'none'>('none');
  zoomedImage: any = null;
  serverUrl = environment.serverUrl;
  
  selectedCategorie: string = 'negafa';
  selectedSousCategorie: string = '';

  expandedSections = {
    negafa: true,
    traiteur: false,
    photographe: false,
    dj: false
  };

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const category = params.get('category');
        if (category) {
          this.loadCategoryFull(category);
          if (Object.keys(this.expandedSections).includes(category)) {
            this.expandedSections[category as keyof typeof this.expandedSections] = true;
          }
        } else {
          this.loadCategoryFull('negafa');
        }
      });
  }

  loadCategoryFull(category: string) {
    this.selectedCategorie = category;
    this.selectedSousCategorie = '';
    this.fetchCatalogueItems(category);
  }

  loadItemsByCategory(sousCategory: string, category: string) {
    this.selectedCategorie = category;
    this.selectedSousCategorie = sousCategory;
    this.fetchCatalogueItems(category, sousCategory);
  }

  private fetchCatalogueItems(category: string, sousCategory?: string) {
    this.loadingCatalogue = true;
    this.catalogueService.getPublicItems(category, sousCategory)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items: any) => {
          this.catalogueItems = Array.isArray(items) ? items : (items.content || []);
          this.loadingCatalogue = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingCatalogue = false;
          this.cdr.detectChanges();
        }
      });
  }

  getSortedCatalogueItems(): CatalogueItem[] {
    let items = [...this.catalogueItems];
    if (this.sortBy() === 'asc') {
      return items.sort((a, b) => (a.prix || a.prixParPersonne || 0) - (b.prix || b.prixParPersonne || 0));
    } else if (this.sortBy() === 'desc') {
      return items.sort((a, b) => (b.prix || b.prixParPersonne || 0) - (a.prix || b.prixParPersonne || 0));
    }
    return items;
  }

  setSort(order: 'asc' | 'desc' | 'none') {
    this.sortBy.set(order);
    this.cdr.detectChanges();
  }

  formatSousCategorie(key: string): string {
    if (!key) return '';
    return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  getCategorieLabel(cat: string): string {
    const labels: any = { negafa: 'Maïtres Negafa', traiteur: 'Gastronomie Royale', photographe: 'Art Visuel', dj: 'Ambiance & DJ', ziana: 'Ziana & Beauté' };
    return labels[cat] || cat;
  }

  getSousCategorieLabel(sub: string): string {
    return this.formatSousCategorie(sub);
  }

  zoomImage(img: any) { this.zoomedImage = img; this.updateBodyState(); }
  closeZoom() { this.zoomedImage = null; this.updateBodyState(); }
  zoomCatalogueItem(item: any) {
    if (item.images && item.images.length > 0) {
      this.zoomImage({ id: item.id, imageUrl: (typeof item.images[0] === 'object' ? item.images[0].url : item.images[0]), categorie: item.categorie, sousCategorie: item.sousCategorie });
    }
  }

  getImageUrl(path: any): string {
    if (!path) return '';
    const actualPath = (typeof path === 'object' && path !== null && 'url' in path) ? path.url : path;
    if (!actualPath || typeof actualPath !== 'string') return '';
    if (actualPath.startsWith('http')) return actualPath;
    const normalizedPath = actualPath.startsWith('/') ? actualPath : '/' + actualPath;
    return this.serverUrl + normalizedPath;
  }

  reserveItem(item: CatalogueItem) {
    if (!this.authService.isLoggedIn) {
      this.toastService.info('Veuillez vous connecter pour réserver cette expérience.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      // In case the user is somehow logged in but on this page, redirect to dashboard to reserve it
      this.router.navigate(['/client/dashboard'], { queryParams: { tab: 'catalogue', category: this.selectedCategorie } });
    }
  }

  private updateBodyState() {
    if (this.zoomedImage) {
      document.body.classList.add('modal-active');
    } else {
      document.body.classList.remove('modal-active');
    }
  }
}
