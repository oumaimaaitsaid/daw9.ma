import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Decorative background -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div class="relative z-10 text-center max-w-lg reveal">
        <div class="mb-12 relative inline-block">
          <h1 class="font-serif text-[180px] font-bold text-secondary/10 leading-none select-none">404</h1>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border border-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 class="font-serif text-4xl font-bold text-secondary mb-6">Page Introuvable</h2>
        <p class="text-text-muted text-sm leading-relaxed mb-12 px-8 uppercase tracking-widest font-medium">
          Il semble que ce chemin mène à une impasse dans notre conciergerie.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a routerLink="/" 
             class="px-10 py-4 bg-secondary text-white rounded-2xl font-serif font-bold text-lg hover:bg-primary transition-all duration-500 shadow-xl shadow-secondary/10">
            Retour à l'Accueil
          </a>
          <button (click)="goBack()" 
                  class="px-10 py-4 border border-secondary/20 text-secondary rounded-2xl font-serif font-bold text-lg hover:bg-secondary/5 transition-all duration-500">
            Page Précédente
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .reveal {
      animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes reveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}
