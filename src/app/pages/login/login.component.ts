import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from '../../utils/services/app.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../utils/services/api.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { SocialService } from 'src/app/utils/services/social.service';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { CasService } from 'src/app/utils/services/cas.service';
import { TOKEN } from 'src/app/utils/items/storage-names';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  loginForm: FormGroup;
  user: any;
  processing = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private appService: AppService,
    private service: ApiService,
    private doctorService: DoctorService,
    private socialAuthService: SocialAuthService,
    private socialService: SocialService,
    private casService: CasService,
    private callService: ACSService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
    //   console.log(user);
    // });

    this.renderer.addClass(document.body, 'login-container');
    
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      remember_me: false
    });
  }

  async logIn() {
    this.processing = true;

    this.service.authenticate(this.loginForm.value)
    .subscribe((response: any) => {
      this.user = response?.user;
      localStorage.setItem(TOKEN, response?.access_token);
      this.getDoctor();
    }, (err) => {
      this.processing = false;
    })
  }

  async getDoctor() {
    this.doctorService.getDoctorByUser(this.user?.id, {includes: 'clinics.resource.services.service_item'})
    .subscribe((response: any) => {
      this.user.doctor = response;
      this.appService.storeUser(this.user);
      this.router.navigate(['/dashboard']);
      // this.updateCommunication();
    });
  }

  async updateCommunication() {
    const credentials = await this.callService.generateToken();

    await this.casService.updateUser(this.user?.id, {
      communication_user_id: credentials?.user?.communicationUserId,
      communication_token: credentials?.token
    }).subscribe((response: any) => {

      this.user.communication_user_id = credentials?.user?.communicationUserId;
      this.user.communication_token = credentials?.token;
      this.appService.storeUser(this.user);
      this.router.navigate(['/dashboard']);
    }, (err) => {
      this.processing = false;
    });

  }

  loginWithGoogle(): void {
   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
    this.socialService.login(user);
   });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-container');
    // this.authSubscription.unsubscribe();
  }
}
