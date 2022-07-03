import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.component.html',
  styleUrls: ['./incoming-call.component.scss']
})
export class IncomingCallComponent implements OnInit {

  @Output()
  accept: EventEmitter<any> = new EventEmitter<any>();
  
  @Output()
  decline: EventEmitter<any> = new EventEmitter<any>();
  
  @Output()
  timeout: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  data: any;

  user: any;
  processing = false;
  maximized = true;
  incomingCall: any;

  constructor(
    private router: Router,
    private service: ScheduleService
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
  }

  acceptAppointment() {
    this.processing = true;
    
    this.service.acceptPatientAppointment(this.data?.appointment_id, {
      resource_communication_user_id: this.user?.communication_user_id,
      resource_communication_token: this.user?.communication_token,
    })
    .subscribe((response: any) => {
      this.router.navigate(['/patient', this.data?.patient_id ,'profile'], { queryParams: { start: true }});
      this.processing = false;
      this.accept.emit();
    }, (err) => {
      this.processing = false;
    });
  }

  async acceptCall() {
    this.acceptAppointment();
  }

  declineCall() {
    this.decline.emit(this.data?.appointment_id);
  }

  timerOut() {
    this.service.missedAppointment(this.data?.appointment_id).subscribe();
    this.timeout.emit();
    // this.declineCall();
  }

}
