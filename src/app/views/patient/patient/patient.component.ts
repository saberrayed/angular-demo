import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Pusher from 'pusher-js';
import { EndConsultationModalComponent } from 'src/app/components/calling/end-consultation-modal/end-consultation-modal.component';
import { EndVideoCallModalComponent } from 'src/app/components/calling/end-video-call-modal/end-video-call-modal.component';
import { PatientBannerComponent } from 'src/app/components/patient/patient-banner/patient-banner.component';
import { VideoCallComponent } from 'src/app/components/video-call/video-call.component';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { AllergyService } from 'src/app/utils/services/mpi/allergy.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { PusherClientService } from 'src/app/utils/services/pusher/pusher-client.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  
  @ViewChild('videoCall', {static: true})
  videoCall: VideoCallComponent;

  @ViewChild('endVideoCallDialog', {static: true})
  endVideoCall: EndVideoCallModalComponent;

  @ViewChild('endConsultationDialog', {static: true})
  endConsultationDialog: EndConsultationModalComponent;

  @ViewChild('banner', {static: true})
  banner: PatientBannerComponent;

  inprogressAppointment: any;

  pusher: Pusher;
  user: any;
  patient: any;
  patientID: any;
  currentTab = 'profile';
  inProgress = false;
  leftPanel = false;

  constructor(
    private route: ActivatedRoute,
    private service: PatientService,
    private allergyService: AllergyService,
    private pusherService: PusherClientService,
    private scheduleService: ScheduleService,
    private toastr: ToastrService,
    private router: Router,
    private renderer: Renderer2,
  ) {}

  async ngOnInit() {

    this.pusherService.pusherSubject.subscribe((response: any) => {
      this.pusher = response;
      setTimeout(() => {
        this.subscribeToCall();
      }, 1);
    });

    this.renderer.addClass(document.body, 'patient-container');
    this.user = getStorage(CURRENT_USER, true);
    this.patientID = this.route.snapshot.params.patient_id;
    this.getPatient();
    this.getUpcomingAppointment();
    this.getInprogressAppointment();
  }

  getPatient() {
    this.service.findPatient(this.patientID, {
      includes: 'allergies,names,addresses,contacts,identifiers,attributes,occupation.industry_type,emergency_contact.relationship,emergency_contact.purpose,families',
      appends: 'present_address,permanent_address'
    })
    .subscribe((response: any) => {
      this.service.setPatient(this.patient = response);
      this.allergyService.setallergies(this.patient?.allergies);
    })
  }

  getUpcomingAppointment() {
    this.scheduleService.getUpcomingAppointment(this.patientID)
    .subscribe((response: any) => {
      this.banner.appointment = response;
    })
  }

  getInprogressAppointment() {
    this.scheduleService.getInprogressAppointment(this.patientID, {
      services: this.user.doctor.clinics?.find((clinic) => clinic?.type_code === 'virtual-clinic')?.resource?.services?.map((service) => service?.id)?.join(',') || ''
    })
    .subscribe((response: any) => {
      this.inprogressAppointment = response;

      if(response) {
        this.subscribeToCurrentAppointmentChannel();

        setTimeout(() => {
          this.leftPanel = true;
          this.configureCallSettings(response);
        }, 300);
      }
      
    });
  }

  async configureCallSettings(appointment) {
    this.videoCall.callerName = this.user?.full;
    this.videoCall.destination = appointment?.patient_communication_user_id;
    await this.videoCall.validateToken(this.user?.communication_token);
  }

  isCurrentPath(homeName) {
    const paths = window?.location?.pathname?.split('/')?.filter((x) => x);
    return paths?.indexOf(homeName) > -1
      ? true
      : false;
  }

  startConsultation() {
    this.videoCall.startCall();
  }

  closeCall() {
    this.leftPanel = false;
  }

  subscribeToCall() {
    this.pusher.subscribe(`private-doctor-consultation-channel-${this.user?.id}`)?.bind("waiting-room", (data: any) => {
      if(data?.patient_id === this.patientID) {
        this.videoCall.destination = data?.communication_user_id;

        if(this.patient) {
          this.patient.communication_user_id = data?.communication_user_id;
        }
      }
    });
  }

  subscribeToCurrentAppointmentChannel() {
    this.pusher.subscribe(`private-appointment-channel-${this.inprogressAppointment?.id}`)?.bind("patient-cancel-appointment", (data: any) => {
      this.toastr.info('Patient has left room');
      this.forceEndCall();
    });
    this.pusher.subscribe(`private-appointment-channel-${this.inprogressAppointment?.id}`)?.bind("appointment-complete", (data: any) => {
      this.forceEndCall();
      this.toastr.info('Appointment is complete');
    });
    this.pusher.subscribe(`private-appointment-channel-${this.inprogressAppointment?.id}`)?.bind("patient-no-show", (data: any) => {
      this.forceEndCall();
      this.toastr.info('Appointment is complete');
    });
  }

  forceEndCall() {
    this.videoCall.endCall();
    this.videoCall.destination = null;
    this.leftPanel = false;
    this.inprogressAppointment = null;
  }

  onEndCall() {
    this.endVideoCall.onOpen();
  }

  endCall() {
    this.videoCall.endCall();
    setTimeout(() => {
      this.endConsultationDialog.onOpen();
    }, 500);
  }

  endConsultation() {
    this.scheduleService.endAppointment(this.inprogressAppointment?.id)
    .subscribe((response: any) => {
      this.inprogressAppointment = null;
      this.leftPanel = false;
      // setTimeout(() => {
      //   this.router.navigate(['/patient-worklist']);
      // }, 500);
    })
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }
}
