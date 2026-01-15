import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { NavbarComponent } from './features/home/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  private authService = inject(AuthService);
  private notifService = inject(NotificationService);

  ngOnInit() {

    const user = this.authService.currentUser;
    const userId = (user as any)?.userId || (user as any)?.id;

    if (userId) {
      this.notifService.connectWebSocket(userId);
    }
  }
}