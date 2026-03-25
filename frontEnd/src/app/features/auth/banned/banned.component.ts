import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-banned',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 overflow-hidden">
      <!-- Background Luxury Elements -->
      <div class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-500/5 rounded-full blur-[120px] -mr-[25vw] -mt-[25vw]"></div>
      <div class="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[120px] -ml-[25vw] -mb-[25vw]"></div>

      <div class="relative max-w-2xl w-full text-center reveal">
        <!-- Luxury Icon -->
        <div class="w-32 h-32 bg-white rounded-full mx-auto mb-12 flex items-center justify-center shadow-luxury border border-primary/10 relative">
          <span class="material-symbols-outlined text-6xl text-red-500">gavel</span>
          <div class="absolute inset-0 border border-primary/5 rounded-full animate-luxury-orbit"></div>
        </div>

        <!-- Typography -->
        <div class="mb-12">
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="w-12 h-[1px] bg-red-500/30"></span>
            <p class="text-[11px] font-black text-red-500 uppercase tracking-[0.5em]">Accès Révoqué</p>
            <span class="w-12 h-[1px] bg-red-500/30"></span>
          </div>
          
          <h1 class="font-serif text-5xl md:text-6xl font-bold text-secondary italic mb-8 leading-tight">
            Privilèges <span class="text-red-500">Suspendus</span>
          </h1>
          
          <p class="text-text-muted text-sm md:text-base leading-relaxed max-w-lg mx-auto font-medium">
            Votre invitation au Cercle Daw9 a été temporairement suspendue par notre administration. 
            L'excellence et le respect de nos codes sont les piliers de notre communauté. Pour toute réclamation relative à cette décision, veuillez contacter notre conciergerie.
          </p>
        </div>

        <!-- Action -->
        <div class="flex flex-col items-center gap-6">
          <button (click)="logout()" 
                  class="group px-10 py-4 bg-secondary text-white rounded-full font-serif text-lg italic hover:bg-primary transition-all duration-500 shadow-premium flex items-center gap-4">
            Quitter la Maison
            <span class="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform">logout</span>
          </button>
          
          <p class="text-[8px] font-black text-primary/40 uppercase tracking-[0.3em]">Code de conduite • Daw9.ma</p>
        </div>
      </div>

      <!-- Corner Details -->
      <div class="absolute bottom-12 right-12 opacity-10">
         <span class="font-serif text-8xl font-black italic select-none">Excellence</span>
      </div>
    </div>
  `,
  styles: [`
    .reveal { animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-luxury { box-shadow: 0 30px 60px -12px rgba(26, 22, 16, 0.08), 0 18px 36px -18px rgba(26, 22, 16, 0.12); }
    .animate-luxury-orbit { animation: orbit 10s linear infinite; }
    @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class BannedComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
