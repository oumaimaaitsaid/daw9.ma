import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
      @for (toast of toasts(); track toast.id) {
        <div class="pointer-events-auto bg-secondary text-white px-6 py-4 rounded-xl shadow-luxury flex items-center gap-4 border border-x-primary/20 reveal max-w-sm"
             [ngClass]="{
               'border-t-primary/50': toast.type === 'info',
               'border-t-green-500': toast.type === 'success',
               'border-t-red-500': toast.type === 'error'
             }">
          <span class="material-symbols-outlined shrink-0"
                [ngClass]="{
                  'text-primary': toast.type === 'info',
                  'text-green-500': toast.type === 'success',
                  'text-red-500': toast.type === 'error'
                }">
            {{ getIcon(toast.type) }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{{ toast.message }}</p>
          </div>
          <button (click)="remove(toast.id)" class="text-white/50 hover:text-white transition-colors shrink-0">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .reveal {
      animation: toastSlideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateX(50px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  getIcon(type: string): string {
    switch(type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
