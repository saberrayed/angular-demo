import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-reschedule-appointment-modal',
  templateUrl: './reschedule-appointment-modal.component.html',
  styleUrls: ['./reschedule-appointment-modal.component.scss']
})
export class RescheduleAppointmentModalComponent implements OnInit {

  @Output()
  reschedule: EventEmitter<any> = new EventEmitter<any>();

  modal = false;
  date: any;
  schedule: any;
  service_item_code: any;
  appointment: any;
  slot: any;
  searching = false;
  processing = false;

  constructor(
    private service: ScheduleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  onOpen(appointment, service_item_code) {
    this.appointment = appointment;
    this.service_item_code = service_item_code;

    const moment = extendMoment(_moment);
    this.date = moment(appointment?.appointment_start_datetime).format('YYYY-MM-DD');

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
    this.service.getServiceSchedules(this.service_item_code, {
      date: this.date,
      resource_id: this.appointment?.resource_id
    })
    .subscribe((response: any) => {
      this.searching = false;
      this.slot = response?.slots?.[0];
      this.schedule = response;
    }, (err) => {
      this.searching = false;
    })
  }

  rescheduleAppointment() {
    this.processing = true;
    this.service.reschuduleAppointment(this.appointment?.id, {
      date: this.date,
      slot_id: this.slot?.id,
      time_start: this.slot?.slot_start_time,
      time_end: this.slot?.slot_end_time,
    })
    .subscribe((response: any) => {
      this.modal = false;
      this.reschedule.emit();
      this.toastr.success(response?.message)
    }, (err) => {
      this.processing = false;
    });
  }
}
