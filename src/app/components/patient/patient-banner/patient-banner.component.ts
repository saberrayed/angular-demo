import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AllergyService } from 'src/app/utils/services/mpi/allergy.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { VideoCallComponent } from '../../video-call/video-call.component';

@Component({
  selector: 'app-patient-banner',
  templateUrl: './patient-banner.component.html',
  styleUrls: ['./patient-banner.component.scss']
})
export class PatientBannerComponent implements OnInit {

  @Output()
  start: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  patient: any;

  @Input()
  inprogressAppointment: any;

  @Input()
  videoCall: VideoCallComponent;

  appointment: any;
  allergies: any;
  
  constructor(
    private service: AllergyService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.service.allergiesSubject.subscribe((response: any) => {
      this.allergies = response?.map((item) => item?.substance )?.join(', ');
    });

    this.patientService.patientSubject.subscribe((response: any) => {
      this.patient = response;
    })
  }

  startConsultation() {
    this.start.emit();
  }

}
