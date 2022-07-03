import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';
import { HmoMastersService } from 'src/app/utils/services/doctor/hmo-masters.service';
import { HmoService } from 'src/app/utils/services/doctor/hmo.service';
import { HospitalMastersService } from 'src/app/utils/services/doctor/hospital-masters.service';
import { HospitalService } from 'src/app/utils/services/doctor/hospital.service';
import { SpecialtiesService } from 'src/app/utils/services/doctor/specialties.service';
import { SpecialtyMastersService } from 'src/app/utils/services/doctor/specialty-masters.service';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  @Output()
  save: EventEmitter<any> = new EventEmitter<any>();

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
    public specialtyMastersService: SpecialtyMastersService,
    public specialtiesService: SpecialtiesService,
    public hmoMastersService: HmoMastersService,
    public hmoService: HmoService,
    public hospitalMastersService: HospitalMastersService,
    public hospitalService: HospitalService,
    public doctorService: DoctorService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER,true);
  }

  setDoctor(doctor) {
    this.doctor = doctor;
    this.createForm();
    setTimeout(() => {
      this.setCredentials();
    }, 1);
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
      specialties: this.fb.array([], [Validators.required, Validators.minLength(1)]),
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

  getControl(name) {
    return this.form.get(name);
  }
}
