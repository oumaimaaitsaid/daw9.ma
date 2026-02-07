import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../../core/services/reservation.service';
import { DemandeReservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations-list.component.html',
  styles: [`
    :host { display: block; }
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .reveal { animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    .reveal-up { animation: revealUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes revealUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReservationsListComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private destroyRef = inject(DestroyRef);

  reservations = signal<DemandeReservation[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  statusFilter = signal<string>('ALL');
  
  successMessage = signal('');
  errorMessage = signal('');

  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);

  filteredReservations = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const sf = this.statusFilter();
    
    return this.reservations().filter(res => {
      const matchesSearch = !q || 
        res.client.nom.toLowerCase().includes(q) ||
        res.client.prenom.toLowerCase().includes(q) ||
        res.client.email.toLowerCase().includes(q);
        
      const matchesStatus = sf === 'ALL' || res.status === sf;
      
      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.reservationService.getReservations(this.currentPage(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.reservations.set(data.content);
          this.totalPages.set(data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des réservations', err);
          this.loading.set(false);
        }
      });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      this.fetchData();
    }
  }

  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  updateStatusFilter(status: string) {
    this.statusFilter.set(status);
  }

  confirm(id: number) {
    this.reservationService.confirmReservation(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showToast('Dossier de réservation confirmé');
          this.fetchData();
        },
        error: () => this.showToast('Erreur lors de la confirmation', true)
      });
  }

  cancel(id: number) {
    this.reservationService.cancelReservation(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showToast('La réservation a été annulée');
          this.fetchData();
        },
        error: () => this.showToast("Erreur lors de l'annulation", true)
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

  getCategoryBadgeClass(categorie: string): string {
    switch (categorie?.toLowerCase()) {
      case 'negafa': return 'bg-primary/5 text-primary';
      case 'traiteur': return 'bg-secondary/5 text-secondary';
      case 'photographe': return 'bg-emerald-50 text-emerald-600';
      case 'dj': return 'bg-blue-50 text-blue-600';
      default: return 'bg-background-light text-text-muted';
    }
  }

  getStatutClass(status: string): string {
    const base = 'px-4 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] uppercase shadow-sm border ';
    switch (status) {
      case 'CONFIRMEE': return base + 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EN_ATTENTE': return base + 'bg-primary/10 text-primary border-primary/20 animate-pulse';
      case 'ANNULEE': return base + 'bg-red-50 text-red-600 border-red-100';
      default: return base + 'bg-gray-50 text-gray-500 border-gray-100';
    }
  }

  getStatutLabel(status: string): string {
    switch (status) {
      case 'CONFIRMEE': return 'CONFIRMÉE';
      case 'EN_ATTENTE': return 'EN ATTENTE';
      case 'ANNULEE': return 'ANNULÉE';
      default: return status;
    }
  }
}