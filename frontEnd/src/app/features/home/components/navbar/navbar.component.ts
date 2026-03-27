import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationActions } from '../../../../core/state/notifications/notification.actions';
import { selectUnreadCount, selectNotifications } from '../../../../core/state/notifications/notification.selectors';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  template: `
    <nav class="sticky top-0 z-[100] bg-white/95 backdrop-blur-2xl border-b border-primary/5 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex justify-between items-center h-24 lg:h-24">
          
          <!-- Logo Section -->
          <a routerLink="/" class="flex items-center no-underline h-full group">
            <app-logo class="scale-[0.7] md:scale-100 transition-transform origin-left" [size]="80" variant="light"></app-logo>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-10">
            <a *ngFor="let link of navLinks" 
               [routerLink]="link.path" 
               [queryParams]="link.queryParams"
               class="nav-link text-[#1a1a1a]">
               {{ link.label }}
            </a>
          </div>

          <!-- Actions & Auth -->
          <div class="flex items-center gap-3 sm:gap-8">
            <!-- Notifications (Solo for Logged In) -->
            <div class="relative" *ngIf="authService.isLoggedIn">
              <button (click)="toggleNotifications()" 
                      class="relative p-2 text-[#1a1a1a] hover:bg-gray-50 rounded-full transition-all">
                <span class="material-symbols-outlined text-[26px]">notifications</span>
                <span *ngIf="(unreadCount$ | async) as count" 
                      class="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                  {{ count }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <div *ngIf="isNotificationsOpen" 
                   class="absolute right-0 mt-5 w-96 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-[#D4AF37]/20 overflow-hidden z-[110] animate-in fade-in zoom-in duration-300">
                
                <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <div class="flex flex-col">
                    <h3 class="font-serif italic font-black text-secondary text-lg">Notifications</h3>
                    <span class="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest">{{ (unreadCount$ | async) || 0 }} Alertes</span>
                  </div>
                  <button (click)="clearAll()" 
                          *ngIf="(notifications$ | async)?.length! > 0"
                          class="text-[11px] text-red-500 hover:text-red-700 font-bold transition-colors uppercase tracking-tight">
                    Tout effacer
                  </button>
                </div>

                <div class="max-h-[380px] overflow-y-auto">
                  <div *ngFor="let notif of (notifications$ | async)" 
                       class="group p-4 hover:bg-gray-50 cursor-pointer transition-all border-b border-gray-50 relative">
                    
                    <div class="flex gap-3">
                      <div [ngClass]="{
                        'bg-green-100 text-green-600': notif?.type === 'RESERVATION_CONFIRMEE',
                        'bg-red-100 text-red-600': notif?.type === 'RESERVATION_ANNULEE',
                        'bg-blue-100 text-blue-600': !notif?.type?.includes('RESERVATION')
                      }" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                        <span class="material-symbols-outlined text-xl">
                          {{ notif?.type === 'RESERVATION_CONFIRMEE' ? 'check_circle' : (notif?.type === 'RESERVATION_ANNULEE' ? 'cancel' : 'info') }}
                        </span>
                      </div>

                      <div class="flex-1 pr-6" (click)="markAsRead(notif.id)">
                        <p class="text-[13px] font-bold text-secondary leading-tight font-serif italic">{{ notif?.titre }}</p>
                        <p class="text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{{ notif?.message }}</p>
                        <span class="text-[8px] font-black text-[#D4AF37] mt-2 block uppercase tracking-widest">{{ notif?.createdAt | date:'HH:mm' }} • DAW9.MA</span>
                      </div>

                      <button (click)="deleteSingle(notif.id); $event.stopPropagation()" 
                              class="absolute right-3 top-4 text-gray-300 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <div *ngIf="(notifications$ | async)?.length === 0" class="p-12 text-center">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span class="material-symbols-outlined text-gray-300 text-3xl">notifications_off</span>
                    </div>
                    <p class="text-gray-500 text-sm font-medium">Aucune notification.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Auth Section -->
            <ng-container *ngIf="!authService.isLoggedIn; else userMenu">
              <a routerLink="/auth/login" class="bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-[12px] font-black font-serif uppercase tracking-[0.2em] hover:bg-black hover:scale-105 transition-all no-underline shadow-lg">
                Connexion
              </a>
            </ng-container>

            <ng-template #userMenu>
              <div class="relative">
                <button (click)="toggleUserMenu()" class="flex items-center gap-3 pl-1 pr-3 py-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-all group">
                  <div class="w-8 h-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center overflow-hidden">
                    <span class="text-primary font-bold text-xs">{{ authService.currentUser?.prenom?.charAt(0) }}{{ authService.currentUser?.nom?.charAt(0) }}</span>
                  </div>
                  <span class="text-sm font-semibold text-[#1a1a1a] hidden sm:block">
                    {{ authService.currentUser?.prenom }}
                  </span>
                  <span class="material-symbols-outlined text-gray-400 text-sm transition-transform" [class.rotate-180]="isUserMenuOpen">expand_more</span>
                </button>

                <!-- User Dropdown -->
                <div *ngIf="isUserMenuOpen" 
                     class="absolute right-0 mt-5 w-64 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-[#D4AF37]/20 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2">
                  <div class="p-6 border-b border-gray-50 bg-gray-50/30">
                    <p class="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-2">Compte VIP</p>
                    <p class="text-base font-serif italic font-black text-secondary truncate">{{ authService.currentUser?.prenom }} {{ authService.currentUser?.nom }}</p>
                  </div>
                  
                  <div class="py-3 px-2">
                    <a [routerLink]="authService.userRole === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'" 
                       class="flex items-center gap-4 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] rounded-xl transition-all no-underline font-serif">
                      <span class="material-symbols-outlined text-xl opacity-20">dashboard</span>
                      <span>Dashboard</span>
                    </a>
                    
                    <!-- Link to Reservations for clients -->
                    <a *ngIf="authService.userRole === 'CLIENT'" routerLink="/client/reservations" 
                       class="flex items-center gap-4 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] rounded-xl transition-all no-underline font-serif">
                      <span class="material-symbols-outlined text-xl opacity-20">event</span>
                      <span>Mes Réservations</span>
                    </a>

                    <a [routerLink]="authService.userRole === 'ADMIN' ? '/admin/profil' : '/client/profil'" 
                       class="flex items-center gap-4 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:bg-[#D4AF37]/5 hover:text-[#D4AF37] rounded-xl transition-all no-underline font-serif">
                      <span class="material-symbols-outlined text-xl opacity-20">person</span>
                      <span>Mon Profil</span>
                    </a>
                  </div>

                  <div class="p-2 border-t border-gray-50">
                    <button (click)="logout()" class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold">
                      <span class="material-symbols-outlined text-lg">logout</span>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            </ng-template>

            <!-- Mobile Menu Toggle -->
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-[#1a1a1a] hover:bg-gray-50 rounded-full">
              <span class="material-symbols-outlined text-[28px]">
                {{ isMobileMenuOpen ? 'close' : 'menu' }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="isMobileMenuOpen" 
           class="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-in slide-in-from-top duration-300">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a *ngFor="let link of navLinks"
               [routerLink]="link.path"
               [queryParams]="link.queryParams"
               (click)="isMobileMenuOpen = false"
               class="block px-3 py-2 text-base font-serif font-black text-secondary hover:bg-primary/5 rounded-lg uppercase tracking-widest">
               {{ link.label }}
            </a>
          </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link {
      font-family: 'Playfair Display', serif;
      font-size: 11px;
      font-weight: 900;
      color: #1a1a1a;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      position: relative;
      padding: 0.5rem 0;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #D4AF37;
      transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    }

    .nav-link:hover {
      color: #D4AF37 !important;
      letter-spacing: 0.35em;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .font-serif {
      font-family: 'Playfair Display', serif;
    }

    :host-context(body.modal-active) nav {
      transform: translateY(-110%);
      opacity: 0;
      pointer-events: none;
    }

    nav {
      transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease;
    }
  `]
})
export class NavbarComponent {
  private store = inject(Store);
  public authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isNotificationsOpen = false;
  isUserMenuOpen = false;
  isMobileMenuOpen = false;

  navLinks = [
    { label: 'Inspiration', path: '/client/dashboard', queryParams: { tab: 'inspirations' } },
    { label: 'Négafa', path: '/client/dashboard', queryParams: { tab: 'catalogue', category: 'negafa' } },
    { label: 'Traiteur', path: '/client/dashboard', queryParams: { tab: 'catalogue', category: 'traiteur' } },
    { label: 'Photographe', path: '/client/dashboard', queryParams: { tab: 'catalogue', category: 'photographe' } },
    { label: 'DJ', path: '/client/dashboard', queryParams: { tab: 'catalogue', category: 'dj' } }
  ];

  unreadCount$ = this.store.select(selectUnreadCount);
  notifications$ = this.store.select(selectNotifications);

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isUserMenuOpen = false;
    if (this.isNotificationsOpen) {
      this.store.dispatch(NotificationActions.loadNotifications());
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isNotificationsOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  clearAll() {
    this.store.dispatch(NotificationActions.clearAllNotifications());
    this.toastService.success('Toutes les notifications ont été effacées');
  }

  markAsRead(id: number) {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }

  deleteSingle(id: number) {
    this.store.dispatch(NotificationActions.deleteNotification({ id }));
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.isMobileMenuOpen = false;
    this.router.navigate(['/']);
  }
}