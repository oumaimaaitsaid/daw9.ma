import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MoodboardImage } from '../models/moodboard.model';

@Injectable({ providedIn: 'root' })
export class MoodboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/client/moodboard`;

  getMoodboard(): Observable<{ content: MoodboardImage[] }> {
    return this.http.get<{ content: MoodboardImage[] }>(this.baseUrl);
  }

  uploadBulk(formData: FormData): Observable<MoodboardImage[]> {
    return this.http.post<MoodboardImage[]>(`${this.baseUrl}/upload-bulk`, formData);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getMatches(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/client/suggestions`);
  }
}
