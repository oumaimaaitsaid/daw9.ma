import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'Load Notifications': emptyProps(),
    'Load Notifications Success': props<{ notifications: any[] }>(),
    'Load Notifications Failure': props<{ error: string }>(),
    'Add New Notification': props<{ notification: any }>(), 
    'Clear All Notifications': emptyProps(),
    'Clear All Notifications Success' : emptyProps(),
    'Mark As Read': props<{ id: number }>(),
    'Mark As Read Success': props<{ id: number }>(),

    'Delete Notification': props<{ id: number }>(),
    'Delete Notification Success': props<{ id: number }>(),
  }
});