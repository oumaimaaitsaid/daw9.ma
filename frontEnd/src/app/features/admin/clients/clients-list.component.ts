import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.component.html'
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  // State using Signals
  clients = signal<Client[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);

  // Computed state for filtering
  filteredClients = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const all = this.clients();
    if (!q) return all;
    
    return all.filter(c => 
      c.nom.toLowerCase().includes(q) || 
      c.prenom.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) ||
      (c.ville && c.ville.toLowerCase().includes(q))
    );
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.clientService.getClients(this.currentPage(), this.pageSize())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.clients.set(data.content);
          this.totalPages.set(data.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      this.refresh();
    }
  }

  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  deleteClient(client: Client) {
    if (confirm(`Voulez-vous révoquer l'accès pour ${client.prenom} ${client.nom} ? Cette action est définitive.`)) {
      this.clientService.deleteClient(client.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
             this.toastService.success(`L'accès pour ${client.prenom} ${client.nom} a été révoqué.`);
             this.refresh();
          },
          error: (err) => this.toastService.error('Erreur lors de la révocation: ' + (err.error?.message || err.message))
        });
    }
  }
}
