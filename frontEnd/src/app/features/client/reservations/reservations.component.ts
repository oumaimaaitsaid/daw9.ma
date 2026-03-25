import { Component, inject, OnInit, ChangeDetectorRef, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../../core/services/reservation.service';
import { DemandeReservation } from '../../../core/models/reservation.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservations.component.html',
  styles: [`
    :host { display: block; }
    .shadow-premium { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03); }
    .shadow-luxury { box-shadow: 0 40px 100px -20px rgba(26, 26, 26, 0.1), 0 0 40px rgba(212, 175, 55, 0.03); }
    .reveal { animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .status-line { position: relative; display: flex; justify-content: space-between; align-items: center; width: 100%; margin: 2rem 0; padding: 0 10px; }
    .status-line::before { content: ''; position: absolute; height: 2px; background: #F1F1F1; top: 13px; left: 10px; right: 10px; z-index: 0; }
    .status-line .progress { position: absolute; height: 2px; background: #D4AF37; top: 13px; left: 10px; z-index: 1; transition: width 1s ease; }
    .status-node { position: relative; z-index: 2; width: 28px; height: 28px; border-radius: 50%; background: #FFF; border: 2px solid #F1F1F1; display: flex; align-items: center; justify-content: center; transition: all 0.5s ease; cursor: default; }
    .status-node.active { border-color: #D4AF37; background: #D4AF37; color: #FFF; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
    .status-label { position: absolute; white-space: nowrap; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 12px; font-size: 7px; font-weight: 800; color: #999; text-transform: uppercase; letter-spacing: 0.15em; transition: color 0.3s ease; }
    .status-node.active .status-label { color: #1A1A1A; }
  `]
})
export class ClientReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  reservations = signal<DemandeReservation[]>([]);
  loading = signal<boolean>(true);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  serverUrl = environment.serverUrl;

  ngOnInit() {
    this.load();
  }

  load() {
    this.reservationService.getClientReservations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.reservations.set(data.content || []);
          this.loading.set(false);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur Backend:", err);
          this.loading.set(false);
          this.cdr.detectChanges();
        }
      });
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    return this.serverUrl + normalizedPath;
  }

  getCategoryColor(categorie: string): string {
    switch (categorie?.toUpperCase()) {
      case 'NEGAFA': return 'bg-primary';
      case 'TRAITEUR': return 'bg-amber-500';
      case 'PHOTOGRAPHE': return 'bg-emerald-500';
      case 'DJ': return 'bg-blue-500';
      case 'ZIANA': return 'bg-pink-400';
      default: return 'bg-secondary';
    }
  }

  getStatutClass(status: string): string {
    switch (status) {
      case 'CONFIRMEE': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'EN_ATTENTE': return 'bg-primary/10 text-primary border border-primary/20 animate-pulse';
      case 'ANNULEE': return 'bg-red-50 text-red-600 border border-red-100';
      default: return 'bg-secondary/5 text-secondary border border-secondary/10';
    }
  }

  getStatutLabel(status: string): string {
    switch (status) {
      case 'CONFIRMEE': return 'Confirmée ✓';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      default: return status;
    }
  }

  getProgressWidth(status: string): string {
    switch (status) {
      case 'EN_ATTENTE': return '0%';
      case 'CONFIRMEE': return '50%';
      case 'REALISEE': return '100%';
      default: return '0%';
    }
  }

  cancelOrder(id: number) {
    if (!confirm('Voulez-vous vraiment annuler ce pack royal ?')) return;

    this.reservationService.cancelClientReservation(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successMessage.set('Votre pack a été annulé avec succès.');
          this.load();
          setTimeout(() => this.successMessage.set(''), 5000);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || "Erreur lors de l'annulation.");
          setTimeout(() => this.errorMessage.set(''), 5000);
        }
      });
  }
}