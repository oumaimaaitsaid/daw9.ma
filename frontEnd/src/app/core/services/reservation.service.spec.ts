import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReservationService } from './reservation.service';
import { DemandeReservation } from '../models/reservation.model';
import { environment } from '../../../environments/environment';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReservationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a reservation', () => {
    const payload: Partial<DemandeReservation> = {
      dateEvenement: '2026-06-15',
      nombreInvites: 200,
      message: 'Soirée VIP'
    };
    const mockResponse: DemandeReservation = {
      id: 1,
      client: { id: 1, nom: 'Test', prenom: 'User', email: 'test@daw9.ma' },
      items: [],
      dateEvenement: '2026-06-15',
      nombreInvites: 200,
      message: 'Soirée VIP',
      montantTotal: 0,
      status: 'EN_ATTENTE',
      createdAt: '2026-03-22T00:00:00'
    };

    service.createReservation(payload).subscribe(res => {
      expect(res.id).toBe(1);
      expect(res.status).toBe('EN_ATTENTE');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/client/reservations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should fetch reservations for current client', () => {
    const mockResponse = {
      content: [
        { id: 1, budget: 5000, status: 'PENDING' }
      ],
      totalElements: 1
    };

    service.getClientReservations().subscribe(res => {
      expect(res.content.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/client/reservations`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
