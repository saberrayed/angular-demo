import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  form: FormGroup;
  
  @Input()
  processing: FormGroup;

  userAgree = false;
  siteKey: any;

  constructor() { }

  ngOnInit(): void {
    this.siteKey = environment.recaptch_site_key;
  }

  getControl(name) {
    return this.form.get(name);
  }

  next() {
    this.submit.emit();
  }

}
