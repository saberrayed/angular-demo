import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { CLINIC_CONSULTATION, CONSULT_LATER, CONSULT_NOW } from 'src/app/utils/items/service-items';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appendFilterParams } from 'src/app/utils/helper/url';

@Component({
  selector: 'app-patient-worklist',
  templateUrl: './patient-worklist.component.html',
  styleUrls: ['./patient-worklist.component.scss']
})
export class PatientWorklistComponent implements OnInit {

  perPages = [5, 10, 25, 50, 100];
  processing = false;
  appointments: any;
  page = 1;
  perPage = 25;
  activeButton = 'consult later'
  selectedService: any;
  user: any;
  form: FormGroup;
  virtualPatients = 0;
  services = {
    consult_now: CONSULT_NOW,
    consult_later: CONSULT_LATER,
    clinic_consult: CLINIC_CONSULTATION,
  }
  currentServices: any[] = [];

  constructor(
    private router: Router,
    private service: ScheduleService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
    this.createForm();
    this.setServices();
    this.list();
    this.getPatientStatistics();
  }

  createForm() {
    this.form = this.fb.group({
      from: [null],
      to: [null],
      patient_name: [null],
      appointment_status: [null],
    });
  }

  setServices() {
    this.user?.doctor?.clinics?.forEach((clinic) => {
      clinic?.resource?.services?.forEach((service) => {
        let index = this.currentServices?.findIndex((service_item) => service_item?.service_item_code === service?.service_item_code );

        if(index < 0 && +service?.service_item?.active === 1) {
          this.currentServices.push(service);
        }
      });      
    });

    this.selectedService = this.currentServices?.[0];
  }

  list(page = 1) {
    this.processing = true;
    const queryParams: any = {};
    queryParams.page = this.page = page;
    queryParams.perPage = this.perPage;
    queryParams.order = 'appointments.appointment_start_datetime';
    queryParams.sort = 'desc';
    queryParams.service_item_code = this.selectedService?.service_item_code || 'undefined';
    queryParams.md_id = getStorage(CURRENT_USER, true)?.doctor?.md_id || 'undefined';
    queryParams.includes = 'patient,resource,service'
    appendFilterParams(queryParams, this.form.value);
    
    this.service.getAppointments(queryParams)
    .subscribe((response: any) => {
      this.processing = false;
      this.appointments = response;
    }, (err) => {
      this.processing = false;
    });
  }

  getPatientStatistics() {
    this.service.getPatientStatistics(getStorage(CURRENT_USER, true)?.doctor?.md_id, 'SRV000000001').subscribe((response: any) => {
      this.virtualPatients = response;
    })
  }

  setService(service) {
    this.selectedService = service;
    this.list();
  }

  startAppointment(appointment) {
    appointment.loading = true;

    if(appointment?.appointment_status === 'in-progress') {
      this.router.navigate(['/patient', appointment?.patient_id]);
    } else {
      this.service.doctorEnterAppointment(appointment?.id, {
        resource_communication_user_id: this.user?.communication_user_id,
        resource_communication_token: this.user?.communication_token,
      }).subscribe((response: any) => {
        this.router.navigate(['/patient', appointment?.patient_id]);
      }, (err) => {
        appointment.loading = false;
      });
    }
  }

  getName(name: string) {
    return name?.split('-')?.join(' ');
  }

  isSameDate(now, next) {
    const moment = extendMoment(_moment);
    return moment(now).format('YYYY-MM-DD') === moment(next).format('YYYY-MM-DD');
  }

  counter(val) {
    return new Array(val);
  }

  changeActiveButton(value: string) {
    this.activeButton = value;
  }
}
