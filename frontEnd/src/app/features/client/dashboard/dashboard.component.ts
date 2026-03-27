import { Component, inject, OnInit, ChangeDetectorRef, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/services/auth.service';
import { ProfilService } from '../../../core/services/profil.service';
import { Client } from '../../../core/models/client.model';
import { MoodboardService } from '../../../core/services/moodboard.service';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BasketService, CatalogueItem } from '../../../core/services/basket.service'; // Import from BasketService
import { ToastService } from '../../../shared/components/toast/toast.service';
import { InspirationGridComponent } from './components/inspiration-grid.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { MoodboardImage, LocalUpload } from '../../../core/models/moodboard.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InspirationGridComponent,
    EmptyStateComponent,
    SkeletonComponent
  ],
  templateUrl: './dashboard.component.html',
  styles: [`
    :host { display: block; }
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .scroll-hidden { -ms-overflow-style: none; scrollbar-width: none; }
    .shadow-premium { box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05); }
    .shadow-luxury { box-shadow: 0 30px 60px -15px rgba(26, 26, 26, 0.1), 0 0 20px rgba(212, 175, 55, 0.05); }
    .reveal { animation: reveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Luxury Splash Animations */
    .animate-splash-content { animation: splashFade 1s ease-out forwards; }
    .animate-luxury-zoom { animation: scaleReveal 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    .animate-luxury-orbit { animation: orbit 4s linear infinite; }
    .animate-luxury-orbit-reverse { animation: orbitReverse 6s linear infinite; }
    .animate-luxury-text { animation: textReveal 1.5s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
    .animate-luxury-progress { animation: progress 1.8s ease-in-out forwards; width: 0; }
    .animate-float { animation: float 10s ease-in-out infinite; }
    .animate-float-delayed { animation: float 12s ease-in-out infinite reverse; }

    @keyframes splashFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleReveal { 
      0% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes orbitReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    @keyframes textReveal {
      0% { opacity: 0; letter-spacing: 0.2em; transform: translateY(10px); }
      100% { opacity: 1; letter-spacing: 0.8em; transform: translateY(0); }
    }
    @keyframes progress { 0% { width: 0; left: 0; } 100% { width: 100%; left: 0; } }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(20px, -20px) scale(1.1); }
    }

    .nav-item { @apply w-full text-left px-4 py-2 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest; }
    .nav-item-active { @apply w-full text-left px-4 py-2 text-[11px] font-black text-secondary border-l-2 border-primary uppercase tracking-widest bg-primary/5; }
  `]
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private profilService = inject(ProfilService);
  private moodboardService = inject(MoodboardService);
  private catalogueService = inject(CatalogueService);
  private reservationService = inject(ReservationService);
  private notificationService = inject(NotificationService);
  public basketService = inject(BasketService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab: 'inspirations' | 'catalogue' = 'inspirations';
  showSplash = signal<boolean>(true);
  moodboard: MoodboardImage[] = [];
  catalogueItems: CatalogueItem[] = [];
  suggestions: any = null;
  loading = true;
  loadingCatalogue = false;
  isDragging = false;
  uploadingCount = signal<number>(0);
  showReservationModal = false;
  showQuoteModal = false;
  showCartDrawer = false;
  moodboardSelection = signal<CatalogueItem[]>([]);
  errorMessage = signal<string>('');
  sortBy = signal<'asc' | 'desc' | 'none'>('none');
  submitting = false;
  zoomedImage: MoodboardImage | null = null;
  selectedCategorie: string = 'negafa';
  selectedSousCategorie: string = '';
  localUploads: LocalUpload[] = [];
  serverUrl = environment.serverUrl;
  minDate: string = new Date().toISOString().split('T')[0];
  successMessage: string = ''; // Used in HTML
  readonly ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

  clientProfile: any = null;
  reservationForm: FormGroup = this.fb.group({
    dateEvenement: ['', [Validators.required, this.futureDateValidator]],
    nombreInvites: [1, [Validators.required, Validators.min(1)]],
    ville: ['', Validators.required],
    message: ['']
  });

  futureDateValidator(control: any) {
    if (!control.value) return null;
    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today ? { pastDate: true } : null;
  }

  expandedSections = {
    negafa: true,
    traiteur: false,
    photographe: false,
    dj: false
  };

  ngOnInit() {
    this.loadProfile();
    this.loadMoodboard();
    this.findMatches();

    // Handle Deep-linking from Navbar
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const tab = params.get('tab');
        const category = params.get('category');

        if (tab === 'inspirations') {
          this.switchTab('inspirations');
        } else if (tab === 'catalogue') {
          this.switchTab('catalogue');
          if (category) {
            this.loadCategoryFull(category);
            // Auto-expand the relevant section for UI consistency
            if (Object.keys(this.expandedSections).includes(category)) {
              this.expandedSections[category as keyof typeof this.expandedSections] = true;
            }
          }
        } else {
          // Default load if no params
          this.loadCategoryFull('negafa');
        }
      });

    // Luxury Splash reveal timer
    setTimeout(() => {
      this.showSplash.set(false);
      this.updateBodyState(); // Initial check
      this.cdr.detectChanges();
    }, 1800);
  }

  loadProfile() {
    this.profilService.getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: Client) => {
          if (profile.active === false) {
            this.router.navigate(['/auth/banned']);
            return;
          }
          this.clientProfile = profile;
          this.notificationService.connectWebSocket(profile.id);
          this.listenForMoodboardUpdates();
          if (profile.dateMarriage) {
            this.reservationForm.patchValue({ dateEvenement: profile.dateMarriage });
          }
          if (profile.ville) {
            this.reservationForm.patchValue({ ville: profile.ville });
          }
          if (profile.nombreInvites) {
            this.reservationForm.patchValue({ nombreInvites: profile.nombreInvites });
          }
          this.cdr.detectChanges();
        },
        error: err => console.error('Erreur chargement profil:', err)
      });
  }

  loadMoodboard() {
    this.moodboardService.getMoodboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.moodboard = data.content || [];
          this.cdr.detectChanges();
        },
        error: err => console.error('Erreur chargement moodboard:', err)
      });
  }

  findMatches() {
    this.loading = true;
    this.moodboardService.getMatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.suggestions = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Erreur suggestions:', err);
          this.loading = false;
          this.cdr.detectChanges();
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

  getSuggestionKeys(): string[] {
    if (!this.suggestions) return [];
    return Object.keys(this.suggestions).filter(key => this.suggestions[key]?.length > 0);
  }

  formatSousCategorie(key: string): string {
    if (!key) return '';
    return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  switchTab(tab: 'inspirations' | 'catalogue') {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
    if (section === 'traiteur' && this.expandedSections.traiteur) {
      this.reservationForm.patchValue({ nombreInvites: this.clientProfile?.nombreInvites || 100 });
    }
  }

  getCategorieLabel(cat: string): string {
    const labels: any = { negafa: 'Maïtres Negafa', traiteur: 'Gastronomie Royale', photographe: 'Art Visuel', dj: 'Ambiance & DJ', ziana: 'Ziana & Beauté' };
    return labels[cat] || cat;
  }

  getSousCategorieLabel(sub: string): string {
    return this.formatSousCategorie(sub);
  }

  addToSelection(item: any, type: string) {
    const exists = this.moodboardSelection().some((i: CatalogueItem) => i.id === item.id);
    if (!exists) {
      this.moodboardSelection.update((s: CatalogueItem[]) => [...s, { ...item, categoryKey: type }]);
    }
    this.cdr.detectChanges();
  }

  removeDraft(index: number) {
    this.moodboardSelection.update((s: CatalogueItem[]) => {
      const newS = [...s];
      newS.splice(index, 1);
      return newS;
    });
    this.cdr.detectChanges();
  }

  moveSelectionToBasket() {
    const items = this.moodboardSelection();
    if (items.length === 0) return;

    items.forEach((item: any) => {
      this.basketService.addItem(item, item.categoryKey);
    });

    this.moodboardSelection.set([]);
    this.toastService.success("Votre sélection a été ajoutée au panier.");
    this.cdr.detectChanges();
  }

  hasDraftSelection(): boolean { return this.moodboardSelection().length > 0; }

  calculateDraftTotal(): number {
    return this.moodboardSelection().reduce((t: number, i: CatalogueItem) => {
      const price = i.prixParPersonne ? (i.prixParPersonne * (this.clientProfile?.nombreInvites || 100)) : (i.prix || 0);
      return t + price;
    }, 0);
  }

  calculateTotal(): number {
    return this.basketService.calculateTotal(this.reservationForm.get('nombreInvites')?.value || 100);
  }

  calculateTotalWithInvites(): number {
    return this.calculateTotal();
  }

  // Mandatory methods for HTML
  toggleCartDrawer() {
    this.showCartDrawer = !this.showCartDrawer;
    this.updateBodyState();
    this.cdr.detectChanges();
  }
  removeSelection(index: number) { this.basketService.removeItem(index); this.cdr.detectChanges(); }

  reserveItemDirectly(item: any) {
    this.basketService.addItem(item, item.categorie);
    this.toastService.success(`${item.nom} ajouté au panier.`);
  }

  openReservationModal() { this.showReservationModal = true; this.updateBodyState(); this.cdr.detectChanges(); }
  closeReservationModal() { this.showReservationModal = false; this.updateBodyState(); this.cdr.detectChanges(); }

  openQuoteModal() { this.showQuoteModal = true; this.updateBodyState(); this.cdr.detectChanges(); }
  closeQuoteModal() { this.showQuoteModal = false; this.updateBodyState(); this.cdr.detectChanges(); }

  printQuote() {
    window.print();
  }

  submitReservation() {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      this.toastService.error("Veuillez remplir tous les champs obligatoires (Date, Invités, Ville).");
      return;
    }

    this.submitting = true;
    const items = this.basketService.items();
    const payload = {
      ...this.reservationForm.value,
      itemIds: items.map(i => i.id)
    };

    // Auto-sync with profile if changed
    if (this.clientProfile && (
        this.reservationForm.value.dateEvenement !== this.clientProfile.dateMarriage ||
        this.reservationForm.value.ville !== this.clientProfile.ville)) {
      this.profilService.updateProfile({
        ...this.clientProfile,
        dateMarriage: this.reservationForm.value.dateEvenement,
        ville: this.reservationForm.value.ville
      }).subscribe(updated => this.clientProfile = updated);
    }

    this.reservationService.createReservation(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.showReservationModal = false;
          this.updateBodyState();
          this.basketService.clear();
          this.successMessage = 'Félicitations ! Votre demande a été transmise à notre conciergerie.';
          this.cdr.detectChanges();
          setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 5000);
        },
        error: err => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Une erreur est survenue.');
          this.cdr.detectChanges();
        }
      });
  }

  hasSelection(): boolean { return this.basketService.items().length > 0; }

  zoomImage(img: MoodboardImage) { this.zoomedImage = img; this.updateBodyState(); }
  closeZoom() { this.zoomedImage = null; this.updateBodyState(); }
  zoomCatalogueItem(item: any) {
    if (item.images && item.images.length > 0) {
      this.zoomImage({ id: item.id, imageUrl: (typeof item.images[0] === 'object' ? item.images[0].url : item.images[0]), categorie: item.categorie, sousCategorie: item.sousCategorie } as any);
    }
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragging = true; }
  onDragLeave(event: DragEvent) { event.preventDefault(); this.isDragging = false; }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files?.length) { this.validateAndUpload(event.dataTransfer.files); }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) { this.validateAndUpload(input.files); }
    input.value = '';
  }

  validateAndUpload(files: FileList) {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (this.ALLOWED_FORMATS.includes(files[i].type)) validFiles.push(files[i]);
    }
    if (validFiles.length > 0) this.executeUpload(validFiles);
  }

  executeUpload(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    this.uploadingCount.update(c => c + files.length);
    this.cdr.detectChanges();

    this.moodboardService.uploadBulk(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success(`${files.length} inspiration(s) analysées.`);
          this.uploadingCount.update(c => Math.max(0, c - files.length));
          this.loadMoodboard();
          this.findMatches();
        },
        error: () => {
          this.toastService.error('Erreur upload.');
          this.uploadingCount.update(c => Math.max(0, c - files.length));
          this.cdr.detectChanges();
        }
      });
  }

  deleteImage(id: number) {
    if (!confirm('Voulez-vous supprimer cette inspiration ?')) return;
    this.moodboardService.deleteImage(id).subscribe(() => { this.loadMoodboard(); this.findMatches(); });
  }

  getImageUrl(path: any): string {
    if (!path) return '';

    // Robustly handle both string paths and objects with a 'url' property
    const actualPath = (typeof path === 'object' && path !== null && 'url' in path) ? path.url : path;

    if (!actualPath || typeof actualPath !== 'string') return '';
    if (actualPath.startsWith('http')) return actualPath;

    const normalizedPath = actualPath.startsWith('/') ? actualPath : '/' + actualPath;
    return this.serverUrl + normalizedPath;
  }

  logout() { this.authService.logout(); }

  private listenForMoodboardUpdates() {
    this.notificationService.moodboardUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedImage: MoodboardImage) => {
        // Use a new array reference to trigger OnPush detection in InspirationGrid
        const index = this.moodboard.findIndex(img => img.id === updatedImage.id);
        if (index !== -1) {
          const newMoodboard = [...this.moodboard];
          newMoodboard[index] = { ...newMoodboard[index], ...updatedImage };
          this.moodboard = newMoodboard;
        } else {
          this.moodboard = [updatedImage, ...this.moodboard];
        }
        
        this.cdr.detectChanges();
      });
  }

  private updateBodyState() {
    if (this.showCartDrawer || this.showReservationModal || this.showQuoteModal || this.zoomedImage) {
      document.body.classList.add('modal-active');
    } else {
      document.body.classList.remove('modal-active');
    }
  }
}
