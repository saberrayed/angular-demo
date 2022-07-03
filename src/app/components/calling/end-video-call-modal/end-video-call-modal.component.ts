import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-end-video-call-modal',
  templateUrl: './end-video-call-modal.component.html',
  styleUrls: ['./end-video-call-modal.component.scss']
})
export class EndVideoCallModalComponent implements OnInit {

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

  endCall() {
    this.end.emit();
    this.modal = false;
  }
}
