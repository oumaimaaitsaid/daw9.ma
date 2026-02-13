import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 px-6 text-center reveal">
      <div class="relative mb-8">
        <!-- Luxury Circle Decoration -->
        <div class="absolute inset-0 bg-primary/5 rounded-full scale-150 blur-2xl"></div>
        <div class="relative w-24 h-24 bg-secondary rounded-full flex items-center justify-center border border-primary/20 shadow-luxury">
          <span class="material-symbols-outlined text-4xl text-primary">{{ icon }}</span>
        </div>
      </div>

      <h3 class="font-serif text-2xl font-bold text-secondary mb-4 tracking-tight">{{ title }}</h3>
      <p class="text-text-muted text-sm max-w-md mx-auto leading-relaxed mb-10 font-medium italic">
        {{ description }}
      </p>

      @if (actionLabel) {
        <button (click)="onAction.emit()" class="btn-luxury-primary group">
          <span class="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">{{ actionIcon }}</span>
          <span>{{ actionLabel }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .reveal {
      animation: revealUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }
    @keyframes revealUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .btn-luxury-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: #1A1A1A;
      color: white;
      padding: 1rem 2rem;
      border-radius: 100px;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      border: 1px solid rgba(211, 175, 55, 0.2);
    }
    .btn-luxury-primary:hover {
      background: #D4AF37;
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -10px rgba(212, 175, 55, 0.3);
      border-color: #D4AF37;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'inventory_2';
  @Input() title: string = 'Aucune donnée trouvée';
  @Input() description: string = 'Il semble que cette section ne contienne pas encore d\'éléments.';
  @Input() actionLabel?: string;
  @Input() actionIcon: string = 'add';
  
  @Output() onAction = new EventEmitter<void>();
}
