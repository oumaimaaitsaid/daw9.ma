import { Component, inject, OnInit, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../../core/services/auth.service';
import { ProfilService } from '../../../core/services/profil.service';
import { MoodboardService } from '../../../core/services/moodboard.service';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { InspirationGridComponent } from './components/inspiration-grid.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { MoodboardImage, LocalUpload } from '../../../core/models/moodboard.model';

interface CatalogueItem {
  id: number;
  nom: string;
  description: string;
  prix?: number;
  prixParPersonne?: number;
  images: string[];
  type: string;
  sousCategorie?: string;
  couleurDominante?: string;
}

interface Selection {
  [key: string]: CatalogueItem | undefined;
}

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
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; flex: 1; min-height: calc(100vh - 100px); }
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .scroll-hidden { -ms-overflow-style: none; scrollbar-width: none; }
    .premium-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(212, 175, 55, 0.1); }
    .shadow-premium { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03); }
    .shadow-luxury { box-shadow: 0 40px 100px -20px rgba(26, 26, 26, 0.15), 0 0 40px rgba(212, 175, 55, 0.05); }
    .reveal { animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    .reveal-up { animation: revealUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    .reveal-scale { animation: revealScale 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes revealScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .nav-item { display: block; width: 100%; text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: #666; border-radius: 1rem; transition: all 0.3s ease; }
    .nav-item:hover { color: #D4AF37; background: rgba(212, 175, 55, 0.05); padding-left: 1.5rem; }
    .nav-item-active { display: block; width: 100%; text-align: left; padding: 0.75rem 1rem; padding-left: 1.5rem; font-size: 0.875rem; font-weight: 700; color: #D4AF37; background: rgba(212, 175, 55, 0.08); border-radius: 1rem; border-left: 3px solid #D4AF37; }
  `]
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private profilService = inject(ProfilService);
  private moodboardService = inject(MoodboardService);
  private catalogueService = inject(CatalogueService);
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  currentUser = this.authService.currentUser;
  moodboard: MoodboardImage[] = [];
  localUploads: LocalUpload[] = [];
  suggestions: any = null;
  selection: Selection = {};
  loading = false;
  uploadingCount = 0;
  showReservationModal = false;
  submitting = false;
  successMessage = '';
  zoomedImage: MoodboardImage | null = null;
  isDragging = false;
  private fb = inject(FormBuilder);
  
  minDate = new Date().toISOString().split('T')[0];

  reservationForm: FormGroup = this.fb.group({
    dateEvenement: ['', [Validators.required, this.futureDateValidator.bind(this)]],
    nombreInvites: [100, [Validators.required, Validators.min(10)]],
    message: ['']
  });

  private futureDateValidator(control: any) {
    if (!control.value) return null;
    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today ? null : { pastDate: true };
  }
  readonly ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  activeTab: 'inspirations' | 'catalogue' = 'inspirations';
  catalogueItems: CatalogueItem[] = [];
  selectedCategorie: string | null = null;
  selectedSousCategorie: string | null = null;
  loadingCatalogue = false;
  clientProfile: any = null;

  expandedSections = {
    negafa: false,
    traiteur: false
  };

  ngOnInit() {
    this.loadMoodboard();
    this.loadProfile();
    this.listenToMoodboardUpdates();
  }

  listenToMoodboardUpdates() {
    this.notificationService.moodboardUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(updatedImg => {
        const index = this.moodboard.findIndex(img => img.id === updatedImg.id);
        if (index !== -1) {
          this.moodboard[index] = updatedImg;
        } else {
          this.moodboard.push(updatedImg);
        }
        this.cdr.detectChanges();
      });
  }

  loadProfile() {
    this.profilService.getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: any) => {
          this.clientProfile = profile;
          if (profile.dateMarriage) {
            this.reservationForm.patchValue({ dateEvenement: profile.dateMarriage });
          }
          if (this.expandedSections.traiteur) {
            this.reservationForm.patchValue({ nombreInvites: this.clientProfile?.nombreInvites || 100 });
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

  getSuggestionKeys(): string[] {
    if (!this.suggestions) return [];
    return Object.keys(this.suggestions).filter(key => this.suggestions[key]?.length > 0);
  }

  formatSousCategorie(key: string): string {
    if (!key) return '';
    return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files?.length) {
      this.validateAndUpload(event.dataTransfer.files);
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndUpload(input.files);
    }
    input.value = '';
  }

  validateAndUpload(files: FileList) {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.ALLOWED_FORMATS.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      this.toastService.error(`Format non supporté pour: ${invalidFiles.join(', ')}. Veuillez utiliser JPG, PNG ou WEBP.`);
    }

    if (validFiles.length > 0) {
      this.executeUpload(validFiles);
    }
  }

  executeUpload(files: File[]) {
    const formData = new FormData();
    const newLocals: LocalUpload[] = [];

    files.forEach(file => {
      formData.append('files', file);
      newLocals.push({
        id: Math.random(),
        url: URL.createObjectURL(file)
      });
    });

    this.localUploads.push(...newLocals);
    this.uploadingCount += files.length;
    this.cdr.detectChanges();

    this.moodboardService.uploadBulk(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: imgs => {
          this.toastService.success(`${files.length} inspiration(s) analysée(s) avec succès.`);
          this.moodboard = [...this.moodboard, ...imgs];
          newLocals.forEach(l => URL.revokeObjectURL(l.url));
          this.localUploads = this.localUploads.filter(lu => !newLocals.find(nl => nl.id === lu.id));
          this.uploadingCount = Math.max(0, this.uploadingCount - files.length);
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Erreur bulk upload:', err);
          newLocals.forEach(l => URL.revokeObjectURL(l.url));
          this.localUploads = this.localUploads.filter(lu => !newLocals.find(nl => nl.id === lu.id));
          this.uploadingCount = Math.max(0, this.uploadingCount - files.length);
          this.cdr.detectChanges();
          
          if (err.status === 400) {
            this.toastService.error("L'analyse AI a échoué. Vérifiez le format de l'image.");
          } else {
             this.toastService.error("Le serveur est momentanément indisponible.");
          }
        }
      });
  }

  deleteImage(id: number) {
    this.moodboardService.deleteImage(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.moodboard = this.moodboard.filter(img => img.id !== id);
          this.cdr.detectChanges();
        },
        error: err => console.error('Erreur suppression:', err)
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

  addToSelection(item: any, type: string) {
    this.selection[type] = item;
    this.cdr.detectChanges();
  }

  removeSelection(type: string) {
    delete this.selection[type];
    this.cdr.detectChanges();
  }

  hasSelection(): boolean {
    return Object.keys(this.selection).length > 0;
  }

  getSelectionKeys(): string[] {
    return Object.keys(this.selection);
  }

  calculateTotal(): number {
    let total = 0;
    for (const key of Object.keys(this.selection)) {
      const item = this.selection[key];
      if (item?.prixParPersonne) {
        total += item.prixParPersonne * 100;
      } else if (item?.prix) {
        total += item.prix;
      }
    }
    return total;
  }

  calculateTotalWithInvites(): number {
    let total = 0;
    for (const key of Object.keys(this.selection)) {
      const item = this.selection[key];
      if (item?.prixParPersonne) {
        total += item.prixParPersonne * (this.reservationForm.get('nombreInvites')?.value || 100);
      } else if (item?.prix) {
        total += item.prix;
      }
    }
    return total;
  }

  openReservationModal() {
    this.showReservationModal = true;
    this.cdr.detectChanges();
  }

  closeReservationModal() {
    this.showReservationModal = false;
    this.cdr.detectChanges();
  }

  submitReservation() {
    if (this.submitting) return;

    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      this.toastService.error('Veuillez remplir correctement le formulaire de réservation.');
      return;
    }

    this.submitting = true;
    this.cdr.detectChanges();

    const selectedItemIds = Object.values(this.selection)
      .filter(item => item !== undefined)
      .map(item => item!.id);

    const payload = {
      clientEmail: this.currentUser?.email || '',
      dateEvenement: this.reservationForm.value.dateEvenement,
      nombreInvites: this.reservationForm.value.nombreInvites,
      message: this.reservationForm.value.message,
      catalogueItemIds: selectedItemIds
    };

    this.reservationService.createReservation(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.submitting = false;
          this.successMessage = 'Réservation envoyée avec succès !';
          this.showReservationModal = false;
          this.selection = {};
          this.cdr.detectChanges();

          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          console.error('Erreur lors de la réservation', err);
          this.submitting = false;
          this.cdr.detectChanges();
          this.toastService.error('Erreur: ' + (err.error?.message || 'Problème de connexion au serveur'));
        }
      });
  }

  zoomImage(img: MoodboardImage) {
    this.zoomedImage = img;
    this.cdr.detectChanges();
  }

  closeZoom() {
    this.zoomedImage = null;
    this.cdr.detectChanges();
  }

  switchTab(tab: 'inspirations' | 'catalogue') {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  toggleSection(section: 'negafa' | 'traiteur') {
    this.expandedSections[section] = !this.expandedSections[section];
    this.cdr.detectChanges();
  }

  loadItemsByCategory(sousCategorie: string, categorie: string) {
    this.selectedCategorie = categorie;
    this.selectedSousCategorie = sousCategorie;
    this.loadingCatalogue = true;
    this.cdr.detectChanges();

    this.catalogueService.getPublicItems(categorie, sousCategorie)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.catalogueItems = res.content || [];
          this.loadingCatalogue = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Erreur chargement catalogue:', err);
          this.loadingCatalogue = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadCategoryFull(categorie: string) {
    this.selectedCategorie = categorie;
    this.selectedSousCategorie = null;
    this.loadingCatalogue = true;
    this.cdr.detectChanges();

    this.catalogueService.getPublicItems(categorie)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.catalogueItems = res.content || [];
          this.loadingCatalogue = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Erreur chargement catégorie:', err);
          this.loadingCatalogue = false;
          this.cdr.detectChanges();
        }
      });
  }

  getCategorieLabel(key: string | null): string {
    if (!key) return '';
    const upperKey = key.toUpperCase();
    const labels: { [key: string]: string } = {
      'NEGAFA': 'Négafa',
      'ZIANA': 'Ziana',
      'TRAITEUR': 'Traiteur',
      'PHOTOGRAPHE': 'Photographe',
      'DJ': 'DJ'
    };
    return labels[upperKey] || key;
  }

  getSousCategorieLabel(key: string | null): string {
    if (!key) return '';
    const labels: { [key: string]: string } = {
      'caftan': 'Caftan', 'takchita': 'Takchita', 'lebsa': 'Lebsa',
      'robe-moderne': 'Robe Moderne', 'jabador': 'Jabador', 'costume': 'Costume',
      'bijoux': 'Bijoux', 'amariya': 'Amariya', 'ziana': 'Ziana', 'entrees': 'Entrées',
      'plats-principaux': 'Plats Principaux', 'desserts': 'Desserts', 
      'gateau-mariage': 'Gâteau de Mariage', 'boissons': 'Boissons'
    };
    return labels[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]/g, ' ');
  }

  zoomCatalogueItem(item: CatalogueItem) {
    if (item.images && item.images.length > 0) {
      this.zoomedImage = {
        id: item.id,
        imageUrl: item.images[0],
        fileName: item.nom,
        categorie: '',
        sousCategorie: item.sousCategorie || '',
        confidence: 100,
        analysisStatus: 'DONE'
      };
      this.cdr.detectChanges();
    }
  }

  addCatalogueItemToSelection(item: CatalogueItem) {
    const key = item.sousCategorie || item.type || 'autre';
    this.selection[key] = item;
    this.successMessage = `${item.nom} ajouté à votre sélection.`;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 2000);
  }

  reserveItemDirectly(item: CatalogueItem) {
    if (!item || this.submitting) return;
    
    this.submitting = true;
    this.cdr.detectChanges();

    const payload = {
      clientEmail: this.currentUser?.email || '',
      dateEvenement: this.clientProfile?.dateMarriage || new Date().toISOString().split('T')[0],
      nombreInvites: this.reservationForm.get('nombreInvites')?.value || 100,
      message: `Réservation directe : ${item.nom}`,
      catalogueItemIds: [item.id]
    };

    this.reservationService.createReservation(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.submitting = false;
          this.successMessage = `Réservation pour "${item.nom}" envoyée avec succès !`;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.submitting = false;
          this.cdr.detectChanges();
          console.error('Erreur réservation directe:', err);
          this.toastService.error('Erreur lors de la réservation : ' + (err.error?.message || 'Problème de connexion'));
        }
      });
  }
}
