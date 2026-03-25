import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const token = authService.token;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401: Non autorisé - Redirection login (sauf si on y est déjà)
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        authService.logout();
        router.navigate(['/auth/login']);
        toastService.error('Session expirée. Veuillez vous reconnecter.');
      } 
      // 0: Erreur réseau
      else if (error.status === 0) {
        toastService.error('Impossible de joindre le serveur. Vérifiez votre connexion.');
      }
      // 403: Interdit (ou compte suspendu)
      else if (error.status === 403) {
        // Logique de Ban : Si le message contient "suspendu" ou si c'est une erreur de permission critique
        const errorMsg = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
        if (errorMsg.toLowerCase().includes('suspendu') || errorMsg.toLowerCase().includes('disabled')) {
           authService.logout(); // On force le logout local
           router.navigate(['/auth/banned']);
        } else {
           toastService.error('Vous n\'avez pas les permissions nécessaires.');
        }
      }
      // 404: Non trouvé
      else if (error.status === 404) {
        // Optionnel: ne pas afficher de toast si c'est géré localement par le composant
        console.warn('Ressource non trouvée:', req.url);
      }
      // 500: Erreur serveur
      else if (error.status >= 500) {
        toastService.error('Une erreur serveur est survenue. Réessayez plus tard.');
      }
      // 400: Mauvaise requête
      else if (error.status === 400 && error.error?.message) {
        toastService.error(error.error.message);
      }

      return throwError(() => error);
    })
  );
};
