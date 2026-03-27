import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Store } from '@ngrx/store';
import { NotificationActions } from '../../core/state/notifications/notification.actions';
import { selectNotifications, selectUnreadCount } from '../../core/state/notifications/notification.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <div class="min-h-screen bg-[#FBFBF9] font-sans flex text-secondary font-medium">
      <!-- Luxury Dark Sidebar -->
      <aside class="fixed top-0 left-0 bottom-0 w-72 bg-[#1A1A1A] border-r border-[#D4AF37]/10 flex flex-col z-50 shadow-2xl overflow-hidden scroll-hidden">
        
        <!-- Logo Area -->
        <div class="h-28 flex items-center px-8 bg-black/20 border-b border-[#D4AF37]/10">
          <a routerLink="/admin/dashboard" class="flex items-center w-full justify-center">
             <app-logo [size]="60" variant="dark" [showTagline]="false"></app-logo>
          </a>
        </div>

        <!-- Navigation Scroll -->
        <nav class="flex-1 overflow-y-auto p-6 space-y-2 py-8 scroll-hidden">
          
          <a routerLink="/admin/dashboard" routerLinkActive="bg-[#D4AF37]/10 text-[#D4AF37]" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center space-x-4 px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group">
            <span class="material-symbols-outlined text-xl group-hover:-translate-y-1 transition-transform">dashboard</span>
            <span class="font-serif text-[13px] uppercase tracking-[0.2em] font-bold">Tableau de Bord</span>
          </a>

          <!-- CATEGORY: NEGAFA -->
          <div class="pt-6">
            <button (click)="toggleSection('negafa')"
                    class="w-full flex items-center justify-between px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group">
              <div class="flex flex-col items-start gap-1">
                 <span class="font-serif text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">Négafa</span>
                 <span class="text-[9px] uppercase tracking-widest text-[#D4AF37]/50">(Tenues & Habillage)</span>
              </div>
              <span class="material-symbols-outlined text-sm transition-transform duration-500" [class.rotate-180]="expandedSections.negafa">expand_more</span>
            </button>
            @if (expandedSections.negafa) {
              <div class="ml-6 mt-2 space-y-1 border-l border-[#D4AF37]/20 pl-6 py-2">
                <p class="text-[8px] uppercase tracking-widest text-white/30 mb-3 px-3">Tenues Mariée</p>
                <a routerLink="/admin/negafa/caftan" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Caftan Royal</a>
                <a routerLink="/admin/negafa/takchita" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Takchita Couture</a>
                <a routerLink="/admin/negafa/lebsa" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Lebsa Tradition</a>
                <a routerLink="/admin/negafa/robe-moderne" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Robe Blanche</a>
                
                <p class="text-[8px] uppercase tracking-widest text-white/30 mt-6 mb-3 px-3">Accessoires</p>
                <a routerLink="/admin/negafa/bijoux" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Parure Bijoux</a>
                <a routerLink="/admin/negafa/amariya" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Amariya</a>
              </div>
            }
          </div>

          <!-- CATEGORY: ZIANA -->
          <a routerLink="/admin/ziana" routerLinkActive="bg-[#D4AF37]/10 text-[#D4AF37]"
             class="flex items-center px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group mt-2">
            <div class="flex flex-col items-start gap-1">
               <span class="font-serif text-lg tracking-wide">Ziana</span>
               <span class="text-[9px] uppercase tracking-widest text-[#D4AF37]/50">(Beauté & Soins)</span>
            </div>
          </a>

          <!-- CATEGORY: TRAITEUR -->
          <div class="pt-2">
            <button (click)="toggleSection('traiteur')"
                    class="w-full flex items-center justify-between px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group">
              <div class="flex flex-col items-start gap-1">
                 <span class="font-serif text-lg tracking-wide group-hover:text-[#D4AF37] transition-colors">Gastronomie</span>
                 <span class="text-[9px] uppercase tracking-widest text-[#D4AF37]/50">(Traiteur & Délices)</span>
              </div>
              <span class="material-symbols-outlined text-sm transition-transform duration-500" [class.rotate-180]="expandedSections.traiteur">expand_more</span>
            </button>
            @if (expandedSections.traiteur) {
              <div class="ml-6 mt-2 space-y-1 border-l border-[#D4AF37]/20 pl-6 py-2">
                <a routerLink="/admin/traiteur/entrees" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Entrées</a>
                <a routerLink="/admin/traiteur/plats-principaux" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Plats principaux</a>
                <a routerLink="/admin/traiteur/desserts" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Délicesucrés</a>
                <a routerLink="/admin/traiteur/gateau-mariage" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Pièce Montée</a>
                <a routerLink="/admin/traiteur/boissons" routerLinkActive="text-[#D4AF37]" class="block px-3 py-2 text-sm text-white/50 hover:text-white hover:translate-x-1 transition-all">Boissons</a>
              </div>
            }
          </div>

          <!-- CATEGORY: PHOTOGRAPHE -->
          <a routerLink="/admin/photographe" routerLinkActive="bg-[#D4AF37]/10 text-[#D4AF37]"
             class="flex items-center px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group mt-2">
            <div class="flex flex-col items-start gap-1">
               <span class="font-serif text-lg tracking-wide">Photographe</span>
               <span class="text-[9px] uppercase tracking-widest text-[#D4AF37]/50">(Art Visuel)</span>
            </div>
          </a>

          <!-- CATEGORY: DJ -->
          <a routerLink="/admin/dj" routerLinkActive="bg-[#D4AF37]/10 text-[#D4AF37]"
             class="flex items-center px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group mt-2">
            <div class="flex flex-col items-start gap-1">
               <span class="font-serif text-lg tracking-wide">Ambiance DJ</span>
               <span class="text-[9px] uppercase tracking-widest text-[#D4AF37]/50">(Son & Lumière)</span>
            </div>
          </a>

          <!-- Section Réservations -->
          <div class="pt-10">
            <p class="px-5 text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-4">Administration</p>
            <a routerLink="/admin/reservations" routerLinkActive="bg-white/5 text-white"
               class="flex items-center space-x-4 px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group relative">
              <span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#D4AF37] rounded-r transition-all group-hover:h-8"></span>
              <span class="material-symbols-outlined text-xl">event_available</span>
              <span class="font-serif text-[13px] uppercase tracking-[0.2em] font-bold">Réservations</span>
            </a>
            
            <a routerLink="/admin/clients" routerLinkActive="bg-white/5 text-white"
               class="flex items-center space-x-4 px-5 py-4 text-white/70 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 group relative mt-2">
              <span class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#D4AF37] rounded-r transition-all group-hover:h-8"></span>
              <span class="material-symbols-outlined text-xl">group</span>
              <span class="font-serif text-[13px] uppercase tracking-[0.2em] font-bold">Clients VIP</span>
            </a>
          </div>
        </nav>

        <!-- User bottom section -->
        <div class="p-6 bg-black/40 border-t border-[#D4AF37]/10 relative">
          <button (click)="toggleMenu()" class="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-colors cursor-pointer group">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C7326] flex items-center justify-center p-[2px]">
              <div class="w-full h-full bg-[#1A1A1A] rounded-full flex items-center justify-center">
                 <span class="text-[#D4AF37] font-serif font-bold">{{ currentUser?.prenom?.charAt(0) }}{{ currentUser?.nom?.charAt(0) }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <p class="text-sm font-bold text-white truncate">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
              <p class="text-[9px] uppercase tracking-widest text-[#D4AF37] mt-1">{{ currentUser?.role || 'Admin' }}</p>
            </div>
            <span class="material-symbols-outlined text-white/50 group-hover:text-white transition-colors">more_vert</span>
          </button>

          <!-- Dropdown Menu -->
          @if (menuOpen) {
            <div class="absolute bottom-[90px] left-6 right-6 bg-[#252525] border border-[#D4AF37]/20 rounded-2xl shadow-2xl py-2 overflow-hidden reveal-up">
              <a routerLink="/admin/profil" class="flex items-center gap-3 px-5 py-3 text-sm text-white hover:bg-[#D4AF37]/10 transition-colors">
                 <span class="material-symbols-outlined text-lg opacity-70">account_circle</span> Mon Profil
              </a>
              <div class="h-[1px] bg-white/5 my-1"></div>
              <button (click)="logout()" class="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                 <span class="material-symbols-outlined text-lg opacity-70">logout</span> Déconnexion
              </button>
            </div>
          }
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="ml-72 flex-1 flex flex-col min-h-screen relative">
         <!-- Top Navbar Transparent -->
         <header class="h-24 sticky top-0 bg-[#FBFBF9]/80 backdrop-blur-md z-40 border-b border-primary/5 flex items-center justify-between px-12">
            <div>
               <!-- Section Title handled by child routes if needed, or placeholder -->
            </div>
            <div class="flex items-center gap-6">
               <!-- Notification Bell Luxury Section -->
               <div class="relative">
                 <button (click)="toggleNotifications()" 
                         class="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-premium hover:shadow-2xl transition-all border border-primary/5 hover:border-primary/30 group">
                   <span class="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">notifications</span>
                   @if (unreadCount() > 0) {
                     <span class="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-bounce">
                        {{ unreadCount() > 9 ? '9+' : unreadCount() }}
                     </span>
                   }
                 </button>

                 <!-- Notification Dropdown Luxury -->
                 @if (notificationsOpen) {
                   <div class="absolute top-16 right-0 w-96 bg-white rounded-[30px] shadow-luxury border border-primary/10 overflow-hidden reveal-up z-50">
                      <div class="p-6 border-b border-primary/5 flex items-center justify-between bg-background-light/30">
                         <h4 class="font-serif text-xl font-bold text-secondary italic">Notifications</h4>
                         <button (click)="markAllAsRead()" class="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70">Tout marquer lu</button>
                      </div>

                      <div class="max-h-[450px] overflow-y-auto scroll-hidden">
                        @if (notifications().length === 0) {
                          <div class="p-12 text-center">
                             <span class="material-symbols-outlined text-4xl text-primary/20 mb-4">drafts</span>
                             <p class="text-[11px] font-medium text-text-muted uppercase tracking-widest">Le journal est vierge</p>
                          </div>
                        } @else {
                          @for (notif of notifications(); track notif.id) {
                            <div class="p-5 border-b border-primary/5 hover:bg-background-light/50 transition-all cursor-pointer group"
                                 [class.bg-primary/5]="!notif.isRead"
                                 (click)="markAsRead(notif.id)">
                               <div class="flex gap-4">
                                  <div class="w-2 h-2 rounded-full mt-2 shrink-0 transition-all duration-500"
                                       [class.bg-primary]="!notif.isRead"
                                       [class.bg-text-muted/20]="notif.isRead"></div>
                                  <div class="flex-1">
                                     <div class="flex justify-between items-start mb-1">
                                        <h5 class="text-sm font-bold text-secondary font-serif italic">{{ notif.titre }}</h5>
                                        <span class="text-[8px] font-bold text-text-muted uppercase tracking-tighter">{{ notif.createdAt | date:'HH:mm' }}</span>
                                     </div>
                                     <p class="text-[11px] text-text-muted leading-relaxed">{{ notif.message }}</p>
                                  </div>
                               </div>
                            </div>
                          }
                        }
                      </div>

                      <div class="p-5 bg-background-light/30 text-center">
                         <a routerLink="/admin/dashboard" class="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:text-primary transition-colors">Voir l'historique complet</a>
                      </div>
                   </div>
                 }
               </div>
            </div>
          </header>

         <!-- Route View -->
         <div class="p-12 pb-24 flex-1">
            <router-outlet></router-outlet>
         </div>
      </main>
    </div>
  `,
  styles: [`
    .scroll-hidden::-webkit-scrollbar { display: none; }
    .scroll-hidden { -ms-overflow-style: none; scrollbar-width: none; }
    
    .shadow-premium {
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03);
    }
    
    .reveal-up {
      animation: revealUp 0.3s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }

    @keyframes revealUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  menuOpen = false;
  notificationsOpen = false;
  currentUser = this.authService.currentUser;

  // Notification State
  notifications = this.store.selectSignal(selectNotifications);
  unreadCount = this.store.selectSignal(selectUnreadCount);

  expandedSections = {
    negafa: false,
    traiteur: false
  };

  ngOnInit(): void {
    const user = this.currentUser;
    if (user && user.userId) {
      // Connect WebSocket & Load initial notifications
      this.notificationService.connectWebSocket(user.userId);
      this.store.dispatch(NotificationActions.loadNotifications());
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) this.notificationsOpen = false;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) this.menuOpen = false;
  }

  markAsRead(id: number): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationActions.clearAllNotifications());
  }

  toggleSection(section: 'negafa' | 'traiteur'): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  logout(): void {
    this.authService.logout();
  }
}
