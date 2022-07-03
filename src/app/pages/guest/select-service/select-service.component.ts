import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  styleUrls: ['./select-service.component.scss']
})
export class SelectServiceComponent implements OnInit {

  patientID: any;
  serviceCode: any;
  services: any;
  doctors: any;
  processing = false;

  constructor(
    private route: ActivatedRoute,
    private service: ScheduleService
  ) { }

  ngOnInit(): void {
    this.patientID = this.route.snapshot.params.patient_id;
    this.getServices();
    this.getOnCallDoctors();
  }

  getOnCallDoctors() {
    this.processing = true;
    this.service.getAppointmentDoctors({
      service_item_code: this.route.snapshot.params.code,
      on_call: this.route.snapshot.queryParams['on-call']
    })
    .subscribe((response: any) => {
      this.doctors = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }

  getServices() {
    this.processing = true;

    this.service.getServices({
      service_item_code: this.serviceCode = this.route.snapshot.params.code,
      includes: 'resource,current_slot'
    })
    .subscribe((response: any) => {
      this.services = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    })
  }
}
