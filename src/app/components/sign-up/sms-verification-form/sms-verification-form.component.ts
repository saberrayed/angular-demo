import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sms-verification-form',
  templateUrl: './sms-verification-form.component.html',
  styleUrls: ['./sms-verification-form.component.scss']
})
export class SmsVerificationFormComponent implements OnInit {

  @Output()
  verify: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  form: FormGroup;

  @Input()
  processing: FormGroup;
  
  code: any = null;
  default: any = '1234';

  constructor() { }

  ngOnInit(): void {
  }

  sendVerificationCode() {
    this.default = Math.floor(1000 + Math.random() * 9000);
  }

  verifyNumber() {
    if(+this.code === +this.default) {
      this.verify.emit();
    }
  }

  validateCode() {
    if(this.code?.length > 3) {
      return +this.code === +this.default ? false : true;
    } else {
      return false;
    }
  }
}
