import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { AppService } from 'src/app/utils/services/app.service';
import { UserService } from 'src/app/utils/services/cas/users.service';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';

@Component({
  selector: 'app-onboarding-successful',
  templateUrl: './onboarding-successful.component.html',
  styleUrls: ['./onboarding-successful.component.scss']
})
export class OnboardingSuccessfulComponent implements OnInit {

  user: any;
  processing = false;

  constructor(
    private userService: UserService,
    private appService: AppService,
    private router: Router,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
  }

  view() {
    this.processing = true;
    this.updateUser();
  }

  updateUser() {
    this.userService.updateUser(this.user?.id, {
      is_new_user: 0,
    })
    .subscribe((response: any) => {
      this.user.is_new_user = 0;
      this.initializeDoctor();
    }, (err) => {
      this.processing = false;
    });
  }

  initializeDoctor() {
    this.doctorService.getDoctorByUser(this.user?.id, {includes: 'clinics.resource.services.service_item'})
    .subscribe((response: any) => {
      this.user.doctor = response;
      localStorage.setItem(CURRENT_USER, JSON.stringify(this.user));
      setTimeout(() => {
        this.appService.setUser(this.user);
        setTimeout(() => {
          this.router.navigate(['/profile/information']);
        }, 1);
      }, 1);
    }, (err) => {
      this.processing = false;
    });
  }

}
