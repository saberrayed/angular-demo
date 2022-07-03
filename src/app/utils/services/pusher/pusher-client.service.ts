import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { api_url, schedule_url } from '../../helper/url';

@Injectable({
  providedIn: 'root'
})
export class PusherClientService {

  pusher: Pusher;
  pusherSubject = new BehaviorSubject<any>(null);
  
  constructor() {
    this.init();
  }
  
  async init() {
    Pusher.logToConsole = false;
    this.pusher = await new Pusher(environment.pusher_app_key, {
        authEndpoint: schedule_url + '/authorize-channel',
        cluster: environment.pusher_app_cluster
    });
    this.pusherSubject.next(this.pusher);
  }
}
