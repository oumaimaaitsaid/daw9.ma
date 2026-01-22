import { Routes } from '@angular/router';
import { clientGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register-client/register-client.component').then(m => m.RegisterClientComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
    path: 'client',
    canActivate: [clientGuard],
    loadComponent: () => import('./layouts/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/client/dashboard/dashboard.component').then(m => m.ClientDashboardComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/client/reservations/reservations.component').then(m => m.ClientReservationsComponent)
      },
      {
        path: 'profil',
        loadComponent: () => import('./features/client/profil/profil.component').then(m => m.ClientProfilComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'admin',
    canActivate: [roleGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      // Routes génériques par sous-catégorie
      {
        path: 'negafa/:sousCategorie',
        loadComponent: () => import('./features/admin/catalogue/catalogue-item.component').then(m => m.CatalogueItemComponent)
      },
      {
        path: 'ziana',
        loadComponent: () => import('./features/admin/catalogue/catalogue-item.component').then(m => m.CatalogueItemComponent),
        data: { sousCategorie: 'ziana' }
      },
      {
        path: 'traiteur/:sousCategorie',
        loadComponent: () => import('./features/admin/catalogue/catalogue-item.component').then(m => m.CatalogueItemComponent)
      },
      {
        path: 'photographe',
        loadComponent: () => import('./features/admin/catalogue/catalogue-item.component').then(m => m.CatalogueItemComponent),
        data: { sousCategorie: 'photographe' }
      },
      {
        path: 'dj',
        loadComponent: () => import('./features/admin/catalogue/catalogue-item.component').then(m => m.CatalogueItemComponent),
        data: { sousCategorie: 'dj' }
      },
      // Gestion
      {
        path: 'clients',
        loadComponent: () => import('./features/admin/clients/clients-list.component').then(m => m.ClientsListComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/admin/reservations/reservations-list.component').then(m => m.ReservationsListComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { 
    path: '**', 
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent) 
  }
];
