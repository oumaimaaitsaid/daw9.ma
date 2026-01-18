import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationActions } from '../../../../core/state/notifications/notification.actions';
import { selectUnreadCount, selectNotifications } from '../../../../core/state/notifications/notification.selectors';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-black/5">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex justify-between items-center h-16 lg:h-[72px]">
          
          <!-- Logo Section -->
          <a routerLink="/" class="flex flex-col no-underline group">
            <span class="text-xl font-bold text-[#1a1a1a] leading-none group-hover:text-primary transition-colors">Daw9.ma</span>
            <span class="text-[10px] text-[#717171] font-medium mt-1 tracking-wide uppercase">Daw9ek howa kolchi</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a *ngFor="let link of navLinks" 
               [routerLink]="link.path" 
               [fragment]="link.fragment"
               class="text-sm font-medium text-[#1a1a1a] hover:text-primary transition-colors no-underline">
               {{ link.label }}
            </a>
          </div>

          <!-- Actions & Auth -->
          <div class="flex items-center gap-3 sm:gap-6">
            <button class="flex items-center gap-1.5 text-[#1a1a1a] hover:text-primary transition-colors text-sm font-medium">
              <span class="material-symbols-outlined text-[24px]">search</span>
              <span class="hidden sm:inline">Qelleb</span>
            </button>

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
                   class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-in fade-in zoom-in duration-200">
                
                <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <div class="flex flex-col">
                    <h3 class="font-bold text-gray-900 text-sm">Notifications</h3>
                    <span class="text-[10px] text-primary font-bold uppercase">{{ (unreadCount$ | async) || 0 }} Nouvelles</span>
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
                        <p class="text-sm font-semibold text-gray-900 leading-tight">{{ notif?.titre }}</p>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{{ notif?.message }}</p>
                        <span class="text-[9px] font-medium text-gray-400 mt-2 block">{{ notif?.createdAt | date:'HH:mm' }} • Daw9.ma</span>
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
              <a routerLink="/auth/login" class="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-all no-underline shadow-sm">
                Se connecter
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
                     class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2">
                  <div class="p-4 border-b border-gray-50">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Active</p>
                    <p class="text-sm font-bold text-gray-900 truncate">{{ authService.currentUser?.prenom }} {{ authService.currentUser?.nom }}</p>
                  </div>
                  
                  <div class="py-2">
                    <a [routerLink]="authService.userRole === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'" 
                       class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-all no-underline">
                      <span class="material-symbols-outlined text-lg">dashboard</span>
                      <span>Dashboard</span>
                    </a>
                    
                    <!-- Link to Reservations for clients -->
                    <a *ngIf="authService.userRole === 'CLIENT'" routerLink="/client/reservations" 
                       class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-all no-underline">
                      <span class="material-symbols-outlined text-lg">event</span>
                      <span>Mes Réservations</span>
                    </a>

                    <a [routerLink]="authService.userRole === 'ADMIN' ? '/admin/profil' : '/client/profil'" 
                       class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-all no-underline">
                      <span class="material-symbols-outlined text-lg">person</span>
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
        <div class="px-6 py-8 flex flex-col gap-6">
          <a *ngFor="let link of navLinks" 
             [routerLink]="link.path" 
             [fragment]="link.fragment"
             (click)="isMobileMenuOpen = false"
             class="text-lg font-bold text-[#1a1a1a] hover:text-primary transition-colors no-underline flex items-center justify-between">
             <span>{{ link.label }}</span>
             <span class="material-symbols-outlined text-gray-300">chevron_right</span>
          </a>
        </div>
      </div>
    </nav>
  `
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
    { label: 'Inspiration', path: '/', fragment: 'inspiration' },
    { label: 'Négafa', path: '/', fragment: 'categories' },
    { label: 'Traiteur', path: '/', fragment: 'categories' },
    { label: 'Photographe', path: '/', fragment: 'categories' },
    { label: 'DJ', path: '/', fragment: 'categories' }
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