import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { getStorage } from 'src/app/utils/helper/storage';
import { ApiService } from 'src/app/utils/services/api.service';
import { UserService } from 'src/app/utils/services/cas/users.service';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';

@Component({
  selector: 'app-onboarding-service-agreement',
  templateUrl: './onboarding-service-agreement.component.html',
  styleUrls: ['./onboarding-service-agreement.component.scss']
})
export class OnboardingServiceAgreementComponent implements OnInit {
  
  processing = false;
  user: any;
  form: FormGroup;

  constructor(
    private router: Router,
    private service: ApiService,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER,true);
    this.createForm();
  }

  createForm() {
    const moment = extendMoment(_moment);

    this.form = new FormGroup({
      auth: this.fb.group({
        email: [this.user.email],
        password: [null, Validators.required],
      }),
      service_agreement: this.fb.group({
        agreement_day: [moment().format('Do')],
        agreement_month: [moment().format('MMMM')],
        agreement_year: [moment().format('YYYY')],
        agreement_location: [],
        name: [this.user?.doctor?.primary_name?.professional],
        signed_date_string: [moment().format('MMM DD, YYYY')],
        signed_date: [moment().format('YYYY-MM-DD')],
        address: [],
        professional_fee: [],
      })
    });
  }

  onSubmit(){
    this.processing = true;
    this.service.verify(this.form.value?.auth)
    .subscribe((response: any) => {
      this.agreeServiceContract();
    }, (err) => {
      this.processing = false;
    });
  }

  agreeServiceContract() {
    this.userService.agreeServiceAgreement(this.user?.id, this.form.value?.service_agreement)
    .subscribe((response: any) => {

      // save onboarding status
      // this.userService.updateUser(this.user?.id, {
      //   onboarding_route: '/onboarding/clinic-setup'
      // }).subscribe();

      alert('You have accepted the Service Agreement. Click OK to continue with the onboarding process.');
      this.router.navigate(['/onboarding/successful']);

    }, (err) => {
      this.processing = false;
    });
  }

}
