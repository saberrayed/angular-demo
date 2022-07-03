import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-cancel-appointment-modal',
  templateUrl: './cancel-appointment-modal.component.html',
  styleUrls: ['./cancel-appointment-modal.component.scss']
})
export class CancelAppointmentModalComponent implements OnInit {

  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  modal = false;
  declineReason: any;
  appointment: any;
  processing = false;

  constructor(
    private service: ScheduleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  onOpen(appointment) {
    this.appointment = appointment;
    this.declineReason = null;
    this.processing = false;
    this.modal = true;
  }

  onClose() {
    this.modal = false;
  }

  cancelAppointment() {
    this.processing = true;
    this.service.cancelAppointment(this.appointment?.id, {
      decline_reason: this.declineReason
    })
    .subscribe((response: any) => {
      this.modal = false;
      this.cancel.emit();
      this.toastr.success(response?.message)
    }, (err) => {
      this.processing = false;
    });
  }
}
