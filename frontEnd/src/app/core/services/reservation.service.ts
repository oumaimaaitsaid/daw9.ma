import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemandeReservation, ReservationStats } from '../models/reservation.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private adminUrl = `${environment.apiUrl}/admin/reservations`;
  private clientUrl = `${environment.apiUrl}/client/reservations`;

  // --- Admin Methods ---
  getReservations(page: number, size: number): Observable<PaginatedResponse<DemandeReservation>> {
    return this.http.get<PaginatedResponse<DemandeReservation>>(`${this.adminUrl}?page=${page}&size=${size}`);
  }

  confirmReservation(id: number): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/${id}/confirm`, {});
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/${id}/cancel`, {});
  }

  getReservationStats(): Observable<ReservationStats> {
    return this.http.get<ReservationStats>(`${this.adminUrl}/stats`);
  }

  // --- Client Methods ---
  getClientReservations(): Observable<PaginatedResponse<DemandeReservation>> {
    return this.http.get<PaginatedResponse<DemandeReservation>>(this.clientUrl);
  }

  createReservation(data: Partial<DemandeReservation>): Observable<DemandeReservation> {
    return this.http.post<DemandeReservation>(this.clientUrl, data);
  }
}
