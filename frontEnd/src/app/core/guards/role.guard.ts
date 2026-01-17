import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.currentUser;
  
  if (user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN')) {
    return true;
  }
  
  // Si le user n'a pas le bon rôle, il est redirigé
  router.navigate(['/']);
  return false;
};
