import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private catalogueSvc = inject(CatalogueService);
  private reservationSvc = inject(ReservationService);
  private clientSvc = inject(ClientService);
  private destroyRef = inject(DestroyRef);

  currentUser = this.authService.currentUser;
  
  // Refactored state into a single signal
  stats = signal({
    negafas: 0,
    traiteurs: 0,
    photographes: 0,
    clients: 0,
    reservations: 0,
    enAttente: 0,
    confirmees: 0,
    annulees: 0
  });

  dashboardAlerts = [
    { msg: 'Nouveau client "Laila B." inscrit', time: 'Il y a 2 min', type: 'registration' },
    { msg: 'Réservation #DXB_12 confirmée', time: 'Il y a 45 min', type: 'success' },
    { msg: 'Mise à jour catalogue "Negafa"', time: "Aujourd'hui, 09:15", type: 'update' }
  ];

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Catalogue Stats
    this.catalogueSvc.getNegafas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(d => {
      this.stats.update(s => ({ ...s, negafas: d.totalElements || 0 }));
    });
    this.catalogueSvc.getTraiteurs().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(d => {
      this.stats.update(s => ({ ...s, traiteurs: d.totalElements || 0 }));
    });
    this.catalogueSvc.getPhotographes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(d => {
      this.stats.update(s => ({ ...s, photographes: d.totalElements || 0 }));
    });

    // Reservations Stats via ReservationService
    this.reservationSvc.getReservationStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.stats.update(s => ({
          ...s,
          reservations: data.total || 0,
          enAttente: data.enAttente || 0,
          confirmees: data.confirmees || 0,
          annulees: data.annulees || 0
        }));
      }
    });

    // Client Count via ClientService (get page 0, size 1 to get totalElements)
    this.clientSvc.getClients(0, 1).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.stats.update(s => ({ ...s, clients: data.totalElements || 0 }));
      }
    });
  }
}
