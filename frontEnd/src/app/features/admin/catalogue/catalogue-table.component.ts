import { Component, Input, Output, EventEmitter, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueItem } from './catalogue.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-catalogue-table',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, SkeletonComponent],
  templateUrl: './catalogue-table.component.html',
  styles: [`
    .reveal { animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-luxury { box-shadow: 0 40px 100px -20px rgba(26, 26, 26, 0.15), 0 0 40px rgba(212, 175, 55, 0.05); }
    .shadow-premium { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03); }
  `]
})
export class CatalogueTableComponent {
  @Input({ required: true }) items!: Signal<CatalogueItem[]>;
  @Input({ required: true }) loading!: Signal<boolean>;
  @Input({ required: true }) filteredItems!: Signal<CatalogueItem[]>;
  @Input({ required: true }) serverUrl: string = '';

  @Output() onEdit = new EventEmitter<CatalogueItem>();
  @Output() onDelete = new EventEmitter<CatalogueItem>();
  @Output() onOpenForm = new EventEmitter<void>();
}
