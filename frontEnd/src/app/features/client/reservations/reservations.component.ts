import { Component, inject, OnInit, ChangeDetectorRef, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReservationService } from '../../../core/services/reservation.service';
import { DemandeReservation } from '../../../core/models/reservation.model';

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
  `]
})
export class ClientReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  reservations = signal<DemandeReservation[]>([]);
  loading = signal<boolean>(true);

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

  findItemByCategorie(res: DemandeReservation, category: string): any {
    if (!res.items) return null;
    return res.items.find(item =>
      item.categorie?.toLowerCase() === category.toLowerCase() ||
      item.type?.toLowerCase() === category.toLowerCase()
    );
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
      case 'CONFIRMEE': return 'Confirmée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      default: return status;
    }
  }

  getItemPrice(data: any): string {
    if (!data) return '';
    if (data.prixParPersonne) return `${data.prixParPersonne} MAD/PERS`;
    return `${data.prix} MAD`;
  }
}