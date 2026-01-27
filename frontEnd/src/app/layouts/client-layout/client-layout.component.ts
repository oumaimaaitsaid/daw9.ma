import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#FBFBF9] font-sans flex flex-col selection:bg-primary/20 selection:text-secondary">

      <main class="flex-1 relative z-10">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer Minimaliste -->
      <footer class="py-12 px-8 border-t border-primary/5 bg-white">
        <div class="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest">© 2024 Daw9.ma — Excellence Événementielle</p>
          <div class="flex gap-8">
            <a href="#" class="text-[9px] font-bold text-text-muted uppercase tracking-widest hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" class="text-[9px] font-bold text-text-muted uppercase tracking-widest hover:text-primary transition-colors">Support Luxe</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class ClientLayoutComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
