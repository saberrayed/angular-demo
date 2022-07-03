import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-end-consultation-modal',
  templateUrl: './end-consultation-modal.component.html',
  styleUrls: ['./end-consultation-modal.component.scss']
})
export class EndConsultationModalComponent implements OnInit {

  @Output()
  end: EventEmitter<any> = new EventEmitter<any>();

  modal = false;

  constructor() {}

  ngOnInit(): void {
  }

  onOpen() {
    this.modal = true;
  }

  onClose() {
    this.modal = false;
  }

  endConsultation() {
    this.end.emit();
    this.modal = false;
  }
}
