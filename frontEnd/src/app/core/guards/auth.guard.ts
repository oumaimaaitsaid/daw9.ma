import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    if (authService.isBanned && !state.url.includes('banned')) {
       router.navigate(['/auth/banned']);
       return false;
    }
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn && authService.userRole === 'CLIENT') {
    if (authService.isBanned) {
       router.navigate(['/auth/banned']);
       return false;
    }
    return true;
  }

  if (authService.isLoggedIn) {
    authService.redirectByRole();
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn && authService.userRole === 'ADMIN') {
    return true;
  }

  if (authService.isLoggedIn) {
    authService.redirectByRole();
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (!authService.isLoggedIn) {
    return true;
  }

  authService.redirectByRole();
  return false;
};
