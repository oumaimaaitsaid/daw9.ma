import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientProfileUpdate } from '../models/client.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private adminUrl = `${environment.apiUrl}/admin/clients`;
  private clientUrl = `${environment.apiUrl}/client/profile`;

  // --- Admin Methods ---
  getClients(page: number, size: number): Observable<PaginatedResponse<Client>> {
    return this.http.get<PaginatedResponse<Client>>(`${this.adminUrl}?page=${page}&size=${size}`);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  // --- Client Profile Methods ---
  getProfile(): Observable<Client> {
    return this.http.get<Client>(this.clientUrl);
  }

  updateProfile(data: ClientProfileUpdate): Observable<Client> {
    return this.http.put<Client>(this.clientUrl, data);
  }
}
