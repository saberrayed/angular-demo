import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TOKEN } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';
import { AppService } from 'src/app/utils/services/app.service';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { CasService } from 'src/app/utils/services/cas.service';
import { UserService } from 'src/app/utils/services/cas/users.service';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { SocialService } from 'src/app/utils/services/social.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  @ViewChild('resetIndicator')
  resetIndicator: ElementRef;

  @ViewChild('confirmIndicator')
  confirmIndicator: ElementRef;

  authSubscription: Subscription;
  loginForm: FormGroup;
  user: any;
  processing = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private service: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {

    this.renderer.addClass(document.body, 'login-container');
    
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  resetPassword() {
    this.processing = true;
    this.service.resetPassword(this.loginForm?.value?.email)
    .subscribe((reponse: any) => {
      this.confirmIndicator.nativeElement.click();
    }, (err) => {
      this.processing = false;
    })
  }

  openEmail() {
    const start = this.loginForm.value.email.indexOf('@') + 1;
    const end = this.loginForm.value.email.length;

    window.location.href = `https://${this.loginForm.value.email.substring(start, end)}`;
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-container');
    // this.authSubscription.unsubscribe();
  }
}
