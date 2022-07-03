import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmsVerificationFormComponent } from 'src/app/components/sign-up/sms-verification-form/sms-verification-form.component';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @ViewChild('termsIndicator')
  termsIndicator: ElementRef;

  @ViewChild('signUpIndicator')
  signUpIndicator: ElementRef;

  @ViewChild('smsVerificationIndicator')
  smsVerificationIndicator: ElementRef;

  @ViewChild('checkEmailIndicator')
  checkEmailIndicator: ElementRef;

  @ViewChild('verifyNumber')
  verifyNumber: SmsVerificationFormComponent;

  form: FormGroup;
  processing = false;

  user: any;

  constructor(
    private renderer: Renderer2,
    private service: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sign-up-container');
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      last: [null, Validators.required],
      first: [null, Validators.required],
      middle: [null],
      suffix: [null],
      date_of_birth: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      contact_no: [null, [Validators.required, Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      password: [null, Validators.required],
      recaptcha: [null, Validators.required]
    });
  }

  agreeTerms() {
    this.signUpIndicator.nativeElement.click();
  }

  register() {
    this.processing = true;
    this.service.register(this.form.value)
    .subscribe((response: any) => {
      this.user = response;
      this.smsVerificationIndicator.nativeElement.click();

      setTimeout(() => {
        this.processing = false;
      }, 1000);
    }, (err) => {
      this.processing = false;
    });
  }

  verify() {
    this.processing = true;
    this.service.verifyMobile(this.user?.id, this.form.value)
    .subscribe((response: any) => {
      this.checkEmailIndicator.nativeElement.click();
      setTimeout(() => {
        this.processing = false;
      }, 1000);
    }, (err) => {
      this.processing = false;
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'sign-up-container');
    // this.authSubscription.unsubscribe();
  }
}
