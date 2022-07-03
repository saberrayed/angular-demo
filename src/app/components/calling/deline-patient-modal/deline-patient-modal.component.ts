import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-deline-patient-modal',
  templateUrl: './deline-patient-modal.component.html',
  styleUrls: ['./deline-patient-modal.component.scss']
})
export class DelinePatientModalComponent implements OnInit {

  @Output()
  decline: EventEmitter<any> = new EventEmitter<any>();

  modal = false;
  declineReason: any;
  appointmentID: any;
  index: any;

  constructor() {}

  ngOnInit(): void {
  }

  onOpen(appointmentID, index) {
    this.appointmentID = appointmentID;
    this.index = index;
    this.declineReason = null;
    this.modal = true;
  }

  onClose() {
    this.modal = false;
  }

  declinePatient() {
    this.decline.emit({
      decline_reason: this.declineReason,
      appointment_id: this.appointmentID,
      index: this.index
    });
    this.modal = false;
  }
}
