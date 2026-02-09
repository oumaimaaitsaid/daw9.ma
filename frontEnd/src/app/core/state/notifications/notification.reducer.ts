import { createReducer, on } from '@ngrx/store';
import { NotificationActions } from './notification.actions';

export interface NotificationState { unreadCount: number; notifications: any[]; }
export const initialState: NotificationState = { unreadCount: 0, notifications: [] };

export const notificationReducer = createReducer(
  initialState,
  on(NotificationActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications,
    unreadCount: notifications.filter(n => n.isRead === false).length
  })),
  on(NotificationActions.addNewNotification, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
  on(NotificationActions.clearAllNotificationsSuccess, (state)=> ({
    ...state,
    notifications:[],
    unreadCount:0
  })),

on(NotificationActions.deleteNotificationSuccess, (state, { id }) => ({
  ...state,
  notifications: state.notifications.filter(n => n.id !== id),

  unreadCount: state.notifications.find(n => n.id === id && !n.isRead) 
               ? state.unreadCount - 1 
               : state.unreadCount
})),

on(NotificationActions.markAsReadSuccess, (state, { id }) => ({
  ...state,
  notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
  unreadCount: Math.max(0, state.unreadCount - 1)
}))
);