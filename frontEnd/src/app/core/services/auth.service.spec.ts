import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUser = {
    email: 'test@example.com',
    token: 'fake-jwt-token',
    role: 'CLIENT',
    prenom: 'Test',
    nom: 'User'
  };

  beforeEach(() => {
    const routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({}),
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store user in localStorage', () => {
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem('currentUser')).toContain('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    service.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should redirect by role: CLIENT', () => {
    // Mock userRole getter by ensuring currentUser is set
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    // Since currentUser is a getter from a private BehaviorSubject initialized from localStorage
    // we need to re-initialize or mock the subject. 
    // In our service implementation, it uses `getStoredUser()` on initialization.
    
    // Redo service injection to pick up localStorage
    service = TestBed.inject(AuthService);

    service.redirectByRole();
    expect(router.navigate).toHaveBeenCalledWith(['/client/dashboard']);
  });

  it('should redirect by role: ADMIN', () => {
    const adminUser = { ...mockUser, role: 'ADMIN' };
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    
    service = TestBed.inject(AuthService);

    service.redirectByRole();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });
});
