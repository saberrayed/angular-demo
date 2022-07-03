import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Pusher from 'pusher-js';
import { VideoCallComponent } from 'src/app/components/video-call/video-call.component';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { PusherClientService } from 'src/app/utils/services/pusher/pusher-client.service';
import { PusherService } from 'src/app/utils/services/pusher/pusher.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit {
  
  @ViewChild('videoCall', {static: false})
  videoCall: VideoCallComponent;

  processing = false;

  credentials: any;
  patients: any;
  selectedPatient: any = null;
  pusher: Pusher;
  waitingRoom = false;

  constructor(
    private acsService: ACSService,
    private service: PatientService,
    private scheduleService: ScheduleService,
    private pusherService: PusherClientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void  {
    this.pusher = this.pusherService.pusher;

    this.initializeCommunication();
    this.listPatient();
  }

  listPatient() {
    this.service.listPatient({
      includes: 'open_visit'
    })
    .subscribe((response: any) => {
      this.patients = response;

      setTimeout(() => {
        this.selectPatient();
      }, 10);
    })
  }

  async updatePatient() {
    this.processing = true;

    await this.service.update(this.selectedPatient?.patient_id, {
      communication_user_id: this.credentials?.user?.communicationUserId,
      communication_token: this.credentials?.token
    }).subscribe((response: any) => {

      this.selectedPatient.communication_user_id = this.credentials?.user?.communication_user_id;
      this.selectedPatient.communication_token = this.credentials?.token;

      this.waitingRoom = true;
      
      setTimeout(async () => {

        await this.videoCall.validateToken(this.selectedPatient?.communication_token);

        this.scheduleService.enterWaitingRoom(1,{
          patient: this.selectedPatient,
          communication_user_id: this.credentials?.user?.communicationUserId,
          doctor: '83e59741-bfdf-4d48-8681-4e15f6b11295'
        }).subscribe((response: any) => {
          this.processing = false;
          this.toastr.success("The doctor will be notified");
        }, (err) => {
          this.toastr.error("Connection Failed");
          this.processing = false;
        })
      }, 1);

    }, (err) => {
      this.processing = false;
    });
  }

  async initializeCommunication() {
    this.credentials = await this.acsService.generateToken();
  }

  selectPatient() {
  }

  async enterWaitingRoom() {

    await this.updatePatient();
  }

  onEndCall() {
    this.videoCall.endCall();
  }

  leaveRoom() {
    this.waitingRoom = false;
  }

}
