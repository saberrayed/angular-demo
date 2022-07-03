import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-didnt-receive-email-modal',
  templateUrl: './didnt-receive-email-modal.component.html',
  styleUrls: ['./didnt-receive-email-modal.component.scss']
})
export class DidntReceiveEmailModalComponent implements OnInit {

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
}
