import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientProfileUpdate } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/client/profile`;

  getProfile(): Observable<Client> {
    return this.http.get<Client>(this.baseUrl);
  }

  updateProfile(data: ClientProfileUpdate): Observable<Client> {
    return this.http.put<Client>(this.baseUrl, data);
  }
}
