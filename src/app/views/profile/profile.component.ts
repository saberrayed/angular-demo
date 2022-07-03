import { Component, OnInit } from '@angular/core';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  doctor: any;
  user: any;

  constructor(
    private service: DoctorService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
    this.getDoctor();
  }

  getDoctor() {
    this.service.getDoctorByUser(this.user?.id, { includes: 'medical_documents,prc_license.file,s2_license.file,ptr_license.file,specialties.specialty,subspecialties.specialty,hospital_affiliations.hospital_master,hmo.hmo_master'})
    .subscribe((response: any) => {
      this.profileService.setDoctor(this.doctor = response);      
    });
  }

  isCurrentPath(homeName) {
    const paths = window?.location?.pathname?.split('/')?.filter((x) => x);
    return paths?.indexOf(homeName) > -1 ? true : false;
  }

}
