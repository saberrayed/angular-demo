import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ProfileChangeMobileComponent } from '../profile-change-mobile/profile-change-mobile.component';

@Component({
  selector: 'app-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.scss']
})
export class ProfileSecurityComponent implements OnInit {

  @ViewChild('startIndicator')
  startIndicator: ElementRef;

  @ViewChild('smsIndicator')
  smsIndicator: ElementRef;

  @ViewChild('passwordIndicator')
  passwordIndicator: ElementRef;

  @ViewChild('changeMobile', {static: true})
  changeMobile: ProfileChangeMobileComponent;

  processing = false;
  form: FormGroup;

  user: any;
  doctor: any;

  constructor(
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
  }

  startPanel() {
    this.startIndicator.nativeElement.click();
  }

  smsVerification() {
    this.changeMobile.createForm();
    this.smsIndicator.nativeElement.click();
  }

  changePassword() {
    this.passwordIndicator.nativeElement.click();
  }
}
