import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HmoMastersService } from 'src/app/utils/services/doctor/hmo-masters.service';
import { HmoService } from 'src/app/utils/services/doctor/hmo.service';
import { HospitalMastersService } from 'src/app/utils/services/doctor/hospital-masters.service';
import { HospitalService } from 'src/app/utils/services/doctor/hospital.service';
import { SpecialtiesService } from 'src/app/utils/services/doctor/specialties.service';
import { SpecialtyMastersService } from 'src/app/utils/services/doctor/specialty-masters.service';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { getStorage } from 'src/app/utils/helper/storage';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { AutocompleteComponent } from 'src/app/components/autocomplete/autocomplete.component';
import { UserService } from 'src/app/utils/services/cas/users.service';

@Component({
  selector: 'app-onboarding-credentials',
  templateUrl: './onboarding-credentials.component.html',
  styleUrls: ['./onboarding-credentials.component.scss']
})
export class OnboardingCredentialsComponent implements OnInit {

  @ViewChild('specialtyComp', {static: false})
  specialtyComp: AutocompleteComponent;
  
  @ViewChild('subspecialtyComp', {static: false})
  subspecialtyComp: AutocompleteComponent;
  
  @ViewChild('hospitalComp', {static: false})
  hospitalComp: AutocompleteComponent;
  
  @ViewChild('hmoComp', {static: false})
  hmoComp: AutocompleteComponent;

  user: any;
  doctor: any;
  form: FormGroup;
  loading = false;
  processing = false;
  hospitalMasters: any = [];
  specialties: any = [];
  subspecialties: any = [];
  hmoMasters: any = [];

  constructor(
    private router: Router,
    private location: Location,
    public specialtyMastersService: SpecialtyMastersService,
    public specialtiesService: SpecialtiesService,
    public hmoMastersService: HmoMastersService,
    public hmoService: HmoService,
    public hospitalMastersService: HospitalMastersService,
    public hospitalService: HospitalService,
    public doctorService: DoctorService,
    private userService: UserService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER,true);
    this.getDoctor();
    this.createForm();
  }

  getDoctor() {
    this.loading = true;
    this.doctorService.getDoctorByUser(this.user?.id, {
      includes: 'specialties.specialty,subspecialties.specialty,hospital_affiliations.hospital_master,hmo.hmo_master'
    })
    .subscribe((response: any) => {
      this.loading = false;
      this.doctor = response;
      this.createForm();
      setTimeout(() => {
        this.setCredentials();
      }, 1);
    }, (err) => {
      this.loading = false;
    });
  }

  setCredentials() {
    this.doctor?.specialties.forEach((item) => {
      this.specialtiesArray.push(this.createSpecialties(item?.specialty));
    });
    this.specialtyComp.selectedResult = this.specialties = this.doctor?.specialties.map((item) => item?.specialty );

    this.doctor?.subspecialties.forEach((item) => {
      this.subspecialtiesArray.push(this.createSubspecialties(item?.specialty));
    });
    this.subspecialtyComp.selectedResult = this.subspecialties = this.doctor?.subspecialties.map((item) => item?.specialty );

    this.doctor?.hospital_affiliations.forEach((item) => {
      this.hospitalAffiliationsArray.push(this.createAffiliation(item?.hospital_master));
    });
    this.hospitalComp.selectedResult = this.hospitalMasters = this.doctor?.hospital_affiliations.map((item) => item?.hospital_master );

    this.doctor?.hmo.forEach((item) => {
      this.hmoAccreditationsArray.push(this.createHmo(item?.hmo_master));
      this.hmoMasters.push(item?.hmo_master);
    });
    this.hmoComp.selectedResult = this.hmoMasters = this.doctor?.hmo.map((item) => item?.hmo_master );
  }

  createForm() {
    this.form = this.fb.group({
      specialties: this.fb.array([], [Validators.required]),
      subspecialties: this.fb.array([]),
      hospital_affiliations: this.fb.array([]),
      hmo_accreditations: this.fb.array([]),
    })
  }

  createSpecialties(specialty) {
    return this.fb.group({
      type_code: ['SP'],
      type_text: ['Specialty'],
      type_display: ['Specialty'],
      specialty_code: [specialty?.code],
      specialty_text: [specialty?.text],
      specialty_display: [specialty?.display],
      parent_specialty_code: [specialty?.parent_specialty?.code],
      parent_specialty_text: [specialty?.parent_specialty?.text],
      parent_specialty_display: [specialty?.parent_specialty?.display],
    });
  }

  createSubspecialties(specialty) {
    return this.fb.group({
      type_code: ['SSP'],
      type_text: ['SubSpecialty'],
      type_display: ['SubSpecialty'],
      specialty_code: [specialty?.code],
      specialty_text: [specialty?.text],
      specialty_display: [specialty?.display],
      parent_specialty_code: [specialty?.parent_specialty?.code],
      parent_specialty_text: [specialty?.parent_specialty?.text],
      parent_specialty_display: [specialty?.parent_specialty?.display],
    });
  }

  createHmo(item) {
    return this.fb.group({
      hmo_code: [item?.hmo_code],
      hmo_text: [item?.hmo_text],
      hmo_display: [item?.hmo_display],
    });
  }

  createAffiliation(item) {
    return this.fb.group({
      health_facility_code_short: [item?.health_facility_code_short]
    });
  }

  loadForm() {
    this.form = new FormGroup({
      specialty: new FormControl('', [Validators.required]),
      subspecialty: new FormControl(''),
      hospital: new FormControl(''),
      hmo: new FormControl(''),
    });
  }
  
  searchHMOMasters(term) {
    this.hmoMastersService.getHMOMasters({ query: term })
    .subscribe((response: any) => {
      this.hmoMasters = response?.data
    });
  }

  searchHospitalMasters(term) {
    this.hospitalMastersService.getHospitalMasters({ query: term })
    .subscribe((response: any) => {
      this.hospitalMasters = response?.data;
    });
  }

  searchSpecialties(term) {
    this.specialtyMastersService.getSpecialtyMasters({ query: term, specialty: true })
    .subscribe((response: any) => {
      this.specialties = response?.data;
    });
  }

  searchSubspecialties(term) {
    this.specialtyMastersService.getSpecialtyMasters({ query: term, subspecialty: true })
    .subscribe((response: any) => {
      this.subspecialties = response?.data;
    });
  }

  updateSpecialtyForm() {
    this.specialtiesArray.clear();
    this.specialtyComp.selectedResult.forEach((item) => {
      this.specialtiesArray.push(this.createSpecialties(item));
    });
  }

  updateSubspecialtyForm() {
    this.subspecialtiesArray.clear();
    this.subspecialtyComp.selectedResult.forEach((item) => {
      this.subspecialtiesArray.push(this.createSubspecialties(item));
    });
  }


  updateHospitalForm() {
    this.hospitalAffiliationsArray.clear();
    this.hospitalComp.selectedResult.forEach((item) => {
      this.hospitalAffiliationsArray.push(this.createAffiliation(item));
    });
  }

  updateHmoForm() {
    this.hmoAccreditationsArray.clear();
    this.hmoComp.selectedResult.forEach((item) => {
      this.hmoAccreditationsArray.push(this.createHmo(item));
    });
  }

  get specialtiesArray() {
    return this.form.get('specialties') as FormArray;
  }

  get subspecialtiesArray() {
    return this.form.get('subspecialties') as FormArray;
  }

  get hospitalAffiliationsArray() {
    return this.form.get('hospital_affiliations') as FormArray;
  }

  get hmoAccreditationsArray() {
    return this.form.get('hmo_accreditations') as FormArray;
  }

  save() {
    this.processing = true;

    this.doctorService.registerCredentails(this.user?.id, this.form.value)
    .subscribe((response: any) => {

      // save onboarding status
      this.userService.updateUser(this.user?.id, {
        onboarding_route: '/onboarding/service-agreement'
      }).subscribe();

      this.router.navigate(['/onboarding/service-agreement']);
    }, (err) => {
      this.processing = false;
    })
  }

  back(){
    this.location.back();
  }

}
