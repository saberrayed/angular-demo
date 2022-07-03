import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-didnt-receive-code-modal',
  templateUrl: './didnt-receive-code-modal.component.html',
  styleUrls: ['./didnt-receive-code-modal.component.scss']
})
export class DidntReceiveCodeModalComponent implements OnInit {

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
