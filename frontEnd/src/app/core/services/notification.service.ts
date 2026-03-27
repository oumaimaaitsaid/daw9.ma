import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { NotificationActions } from '../state/notifications/notification.actions';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private http = inject(HttpClient);
  private store = inject(Store);
  
  public moodboardUpdate$ = new Subject<any>();

  private stompClient!: Client;

  // HTTP call (Initial load)
  getAllNotifications(userId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/notifications/user/${userId}`);
  }

  getRecentActivity() {
    return this.http.get<any[]>(`${environment.apiUrl}/notifications/all`);
  }

  // WebSocket Connection
  connectWebSocket(userId: number) {

    const socket = new SockJS(`${environment.apiUrl.replace('/api', '')}/ws-notifications`);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      reconnectDelay: 5000,

      onConnect: () => {

        this.stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
          if (message.body) {
            const notification = JSON.parse(message.body);
            this.store.dispatch(NotificationActions.addNewNotification({ notification }));
          }
        });

        // 🖼️ Moodboard Real-time Updates
        this.stompClient.subscribe(`/topic/moodboard/${userId}`, (message) => {
          if (message.body) {
            const updatedImage = JSON.parse(message.body);
            // On peut dispatcher une action ou utiliser un Subject pour prévenir le component
            this.moodboardUpdate$.next(updatedImage);
          }
        });
      }
    });

    this.stompClient.activate();
  }
}