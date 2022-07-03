import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verify-email-notice',
  templateUrl: './verify-email-notice.component.html',
  styleUrls: ['./verify-email-notice.component.scss']
})
export class VerifyEmailNoticeComponent implements OnInit {

  @Output()
  verify: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  form: FormGroup;

  @Input()
  user: FormGroup;
  
  code: any = null;
  default: any = '1234';
  
  constructor() { }

  ngOnInit(): void {
  }

  verifyNumber() {
    this.verify.emit();
  }

  validateCode() {
    if(this.code?.length > 3) {
      return +this.code === +this.default ? false : true;
    } else {
      return false;
    }
  }
}
