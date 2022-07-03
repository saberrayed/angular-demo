import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appendQueryParams, cas_url } from '../../helper/url';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotifications(id, queryParams = {}) {
    return this.http.get(
      `${cas_url}/notifications/${id}${appendQueryParams(queryParams)}`
    );
  }

  userUnreadCount(id, queryParams = {}) {
    return this.http.get(
      `${cas_url}/user/${id}/notifications/unread${appendQueryParams(queryParams)}`
    );
  }
  
  markAsRead(id, notifID, queryParams = {}) {
    return this.http.get(
      `${cas_url}/notifications/${id}/mark-as-read/${notifID}${appendQueryParams(queryParams)}`
    );
  }
}
