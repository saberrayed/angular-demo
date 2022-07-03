import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VideoCallComponent } from 'src/app/components/video-call/video-call.component';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { PusherClientService } from 'src/app/utils/services/pusher/pusher-client.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  
  @ViewChild('videoCall', {static: false})
  videoCall: VideoCallComponent;

  patientID: any;
  processing = true;
  credentials: any;
  selectedPatient: any = null;
  appointment: any;
  waitingRoom = false;
  destination: any;
  leaving = false;
  pusher: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PatientService,
    private scheduleService: ScheduleService,
    private toastr: ToastrService,
    private pusherService: PusherClientService
  ) {}

  ngOnInit(): void  {
    this.patientID = this.route.snapshot.params.patient_id;
    this.getPatient();

    this.pusherService.pusherSubject.subscribe((response: any) => {
      this.pusher = response;
      this.subscribeToAppointment();
    });
  }

  subscribeToAppointment() {
    this.pusher.subscribe(`private-appointment-channel-${this.route.snapshot.params.appointment_id}`)
    ?.bind("end-appointment", (data: any) => {
      this.toastr.success('Doctor has ended the consultation', '', {timeOut: 3000});
      this.router.navigate(['/guest', this.patientID]);
    });
  }


  getPatient() {
    this.processing = true;
    this.service.findPatient(this.route.snapshot.params.patient_id, {
      includes: 'open_visit'
    })
    .subscribe((response: any) => {
      this.selectedPatient = response;
      this.processing = false;

      this.getAppointment();
    }, (err) => {
      this.processing = false;
    });
  }

  getAppointment() {
    this.scheduleService.getAppointment(this.route.snapshot.params.appointment_id)
    .subscribe((response: any) => {
      this.appointment = response;
      this.destination = response?.resource_communication_user_id;
      this.updateCommunication();
    })
  }

  leave() {
    this.leaving = true;
    this.scheduleService.leaveWaitingRoom(this.route.snapshot.params.appointment_id, {})
    .subscribe((response: any) => {

      if(this.videoCall?.currentCall?.state === 'Connected') {
        this.videoCall.endCall();
      }

      this.router.navigate(['/guest', this.patientID]);
    }, (err) => {
      this.leaving = false;
      this.toastr.error("Connection Failed");
    });
  }

  async updateCommunication() {
    this.credentials = {
      token: this.appointment.patient_communication_token,
      user: {communicationUserId: this.appointment.patient_communication_user_id}
    };
    this.videoCall.callerName = this.selectedPatient?.primary_name?.full;
    this.videoCall.destination = this.destination;
    await this.videoCall.validateToken(this.appointment.patient_communication_token);
  }

  onEndCall() {
    this.videoCall.endCall();
  }
}
