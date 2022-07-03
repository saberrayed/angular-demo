import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';
import { FormBuilder } from '@angular/forms';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';

@Component({
  selector: 'app-create-appointment-modal',
  templateUrl: './create-appointment-modal.component.html',
  styleUrls: ['./create-appointment-modal.component.scss']
})
export class CreateAppointmentModalComponent implements OnInit {

  @Output()
  reschedule: EventEmitter<any> = new EventEmitter<any>();

  user: any;
  modal = false;
  date: any;
  schedule: any;
  complaint: any;
  service_item_code: any;
  appointment: any;
  slot: any;
  clinic: any;
  item: any;
  patient: any;
  searching = false;
  processing = false;

  constructor(
    private service: ScheduleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
  }

  onOpen(patient) {
    this.patient = patient;
    
    this.clinic = this.activeClinics()?.[0];
    this.item = this.clinic?.resource?.services?.[0];
    this.complaint = null;

    const moment = extendMoment(_moment);
    this.date = moment().format('YYYY-MM-DD');

    this.getServiceSchedule();

    this.searching = false;
    this.processing = false;
    this.modal = true;
  }

  onClose() {
    this.modal = false;
  }

  getServiceSchedule() {
    this.searching = true;
    this.service.getServiceSchedules(this.item?.service_item_code, {
      date: this.date,
      resource_id: this.item?.resource_id
    })
    .subscribe((response: any) => {
      this.searching = false;
      this.slot = response?.slots?.[0];
      this.schedule = response;
    }, (err) => {
      this.searching = false;
    });
  }

  createAppointment() {
    this.processing = true;

    this.service.book(this.appointment?.id, {
      patient_id: this.patient?.patient_id,
      service_id: this.item?.id,
      resource_id: this.item?.resource_id,
      slot_id: this.slot?.id,
      complaint: this.complaint,
      date: this.date
    })
    .subscribe((response: any) => {
      this.modal = false;
      this.reschedule.emit();
      this.toastr.success("Successfully booked an appointment")
    }, (err) => {
      this.processing = false;
    });
  }

  activeClinics() {
    return this.user?.doctor?.clinics?.filter((clinic) => clinic?.type_code !== 'virtual-clinic' );
  }
}
