import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VideoCallComponent } from 'src/app/components/video-call/video-call.component';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { PusherClientService } from 'src/app/utils/services/pusher/pusher-client.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-appointment-room',
  templateUrl: './appointment-room.component.html',
  styleUrls: ['./appointment-room.component.scss']
})
export class AppointmentRoomComponent implements OnInit {
  
  @ViewChild('videoCall', {static: false})
  videoCall: VideoCallComponent;

  pusher: any;
  patientID: any;
  processing = true;
  credentials: any;
  selectedPatient: any = null;
  appointment: any;
  waitingRoom = false;
  destination: any;
  leaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private acsService: ACSService,
    private service: PatientService,
    private scheduleService: ScheduleService,
    private pusherService: PusherClientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void  {
    this.patientID = this.route.snapshot.params.patient_id;
    this.getAppointment();

    this.pusherService.pusherSubject.subscribe((response: any) => {
      this.pusher = response;
      this.subscribeToAppointment();
    });
  }

  getAppointment() {
    this.processing = true;
    this.scheduleService.getAppointment(this.route.snapshot.params.appointment_id, { includes: 'patient,service.resource.map,resource.doctor' })
    .subscribe((response: any) => {
      this.processing = false;
      this.appointment = response;
      this.destination = response?.resource_communication_user_id;
      this.updateAppointment();
    }, (err) => {
      this.processing = false;
    })
  }

  async updateAppointment() {
    this.credentials = await this.acsService.generateToken();

    this.scheduleService.updateAppointment(this.route.snapshot.params.appointment_id, {
      patient_communication_user_id: this.credentials?.user?.communicationUserId,
      patient_communication_token: this.credentials?.token,
    })
    .subscribe((response: any) => {
      if(response?.resource_communication_user_id) {
        this.router.navigate(['/guest', this.patientID, 'appointment', this.appointment?.id]);
      } else {
        this.notifyDoctor();
      }
    });
  }

  notifyDoctor() {
    this.scheduleService.enterWaitingRoom(this.route.snapshot.params.appointment_id, {
      patient: this.patientID,
      communication_user_id: this.credentials?.user?.communicationUserId,
      doctor: this.appointment?.resource?.doctor?.user_id, // make this dynamic
      reason: this.appointment?.visit_reason,
      appointment_id: this.route.snapshot.params.appointment_id
    }).subscribe((response: any) => {
      this.processing = false;
      this.toastr.success("The doctor will be notified");
    }, (err) => {
      this.toastr.error("Connection Failed");
      this.processing = false;
    });
  }

  timerOut() {
    this.toastr.info("The doctor missed the call you will be redirected shortly.", '', {timeOut: 3000});
    
    this.scheduleService.missedAppointment(this.route.snapshot.params.appointment_id)
    .subscribe((response: any) => {
      setTimeout(() => {
        this.router.navigate(['/guest', this.patientID]);
      }, 2000);
    })
  }

  subscribeToAppointment() {
    this.pusher.subscribe(`private-appointment-channel-${this.route.snapshot.params.appointment_id}`)
    ?.bind("accept-appointment", (data: any) => {
      this.toastr.info("Appointment accepted");
      this.router.navigate(['/guest', this.patientID, 'appointment', this.route.snapshot.params.appointment_id]);
    });

    this.pusher.subscribe(`private-appointment-channel-${this.route.snapshot.params.appointment_id}`)
    ?.bind("doctor-entered-appointment", (data: any) => {
      this.toastr.info("Doctor is in");
      this.router.navigate(['/guest', this.patientID, 'appointment', this.route.snapshot.params.appointment_id]);
    });

    this.pusher.subscribe(`private-appointment-channel-${this.route.snapshot.params.appointment_id}`)
    ?.bind("decline-appointment", (data: any) => {
      this.toastr.info("Appointment declined");
      this.router.navigate(['/guest', this.patientID]);
    });
  }

  leave() {
    this.leaving = true;
    this.scheduleService.leaveWaitingRoom(this.route.snapshot.params.appointment_id, {})
    .subscribe((response: any) => {
      this.router.navigate(['/guest', this.patientID]);
    }, (err) => {
      this.leaving = false;
      this.toastr.error("Connection Failed");
    });
  }
}
