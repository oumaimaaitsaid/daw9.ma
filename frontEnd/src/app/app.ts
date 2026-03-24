import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { NavbarComponent } from './features/home/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  protected showNavbar = signal(true);

  private authService = inject(AuthService);
  private notifService = inject(NotificationService);
  private router = inject(Router);

  ngOnInit() {

    const user = this.authService.currentUser;
    const userId = (user as any)?.userId || (user as any)?.id;

    if (userId) {
      this.notifService.connectWebSocket(userId);
    }

    // Gestion de la visibilité de la navbar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url || '';
      console.log('[Navbar Check] Current URL:', url);
      this.updateNavbarVisibility(url);
    });

    // Initial check
    this.updateNavbarVisibility(this.router.url);
  }

  private updateNavbarVisibility(url: string) {
    const isExcluded = url.includes('/admin') || url.includes('/auth') || url === '/login' || url === '/register';
    this.showNavbar.set(!isExcluded);
  }
}