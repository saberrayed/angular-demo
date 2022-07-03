import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Pusher from 'pusher';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  pusher: any;
  
  constructor(private http: HttpClient) {
    this.pusher = new Pusher({
      appId: environment.pusher_app_id,
      key: environment.pusher_app_key,
      secret: environment.pusher_app_secret,
      cluster: environment.pusher_app_cluster,
      useTLS: true
    });
    
    // this.pusher.trigger("my-channel", "my-event", {
    //   message: "hello world"
    // });
  }
}
