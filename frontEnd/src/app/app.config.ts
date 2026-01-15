import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';


import { notificationReducer } from './core/state/notifications/notification.reducer';
import { NotificationEffects } from './core/state/notifications/notification.effects'; // Import direct// Import as *

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      notification: notificationReducer
    }),
    // 2. Passi l-object li fih l-effects
    provideEffects([NotificationEffects])
  ]
};