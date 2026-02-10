import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; 

import { NotificationService } from '../../services/notification.service';
import { NotificationActions } from './notification.actions';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment'; 

@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private http = inject(HttpClient); 

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      switchMap(() => {
        const user = this.authService.currentUser; 
        
        const userId =  (user as any)?.userId; 

        if (!userId) {
          return of(NotificationActions.loadNotificationsFailure({ error: 'User not found' }));
        }

        return this.notificationService.getAllNotifications(userId).pipe(
          map(notifications => NotificationActions.loadNotificationsSuccess({ notifications })),
          catchError(error => of(NotificationActions.loadNotificationsFailure({ error: error.message })))
        );
      })
    )
  );

  clearAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.clearAllNotifications),
      switchMap(() => {
        const user = this.authService.currentUser;
        const userId = (user as any)?.userId;
        
        if (!userId) {
          return of({ type: 'Error', error: 'User not found' });
        }

        return this.http.delete(`${environment.apiUrl}/notifications/user/${userId}/clear`).pipe(
          map(() => NotificationActions.clearAllNotificationsSuccess()),
          catchError(error => of({ type: 'Error' }))
        );
      })
    )
  );

deleteNotification$ = createEffect(() =>
  this.actions$.pipe(
    ofType(NotificationActions.deleteNotification),
    mergeMap(({ id }) => 
      this.http.delete(`${environment.apiUrl}/notifications/${id}`).pipe(
        map(() => NotificationActions.deleteNotificationSuccess({ id })),
        catchError(() => of({ type: 'Error' }))
      )
    )
  )
);


markAsRead$ = createEffect(() =>
  this.actions$.pipe(
    ofType(NotificationActions.markAsRead),
    mergeMap(({ id }) => 
      this.http.put(`${environment.apiUrl}/notifications/${id}/read`, {}).pipe(
        map(() => NotificationActions.markAsReadSuccess({ id })),
        catchError(() => of({ type: 'Error' }))
      )
    )
  )
);
}