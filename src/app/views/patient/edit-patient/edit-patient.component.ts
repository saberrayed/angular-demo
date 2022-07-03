import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ACSService } from 'src/app/utils/services/azure/acs.service';
import { RegistrationComponent } from 'src/app/components/patient/registration/registration.component';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {

  @Input()
  patient: any;
  
  @ViewChild('patientRegistration', {static: true})
  patientRegistrationComponent: RegistrationComponent;

  sex: any;
  form: any;
  age: any = 0;
  months: any;
  days: any;
  maxYear: any;
  possibleMonth: any = 0;
  possibleDay: any = 0;
  nationalities: any;
  religions: any;
  civilStatuses: any;
  patientID: any;
  processing = false;

  confirm = false;
  isValid = false;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private service: PatientService,
    private acsService: ACSService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
    this.patientID = this.route.parent.snapshot.params.patient_id;
    this.service.patientSubject.subscribe((response: any) => {
      if(response) {
        this.patient = response;
        this.initialize();
      }
    })
  }

  initialize() {
    this.patientRegistrationComponent.patient = this.patient;
    this.patientRegistrationComponent.createPatientForm();

    setTimeout(() => {
      this.patientRegistrationComponent.patientForm.get('patient.md_id').setValue(this.user?.doctor?.md_id);
      this.patientRegistrationComponent.initializeAttributes();
      this.patientRegistrationComponent.initializeContacts();
      this.patientRegistrationComponent.initializeIdentifiers();
      this.patientRegistrationComponent.initializeFamilies();
      this.patientRegistrationComponent.initializeAddresses();
      this.patientRegistrationComponent.occupationComponent.initializeIndustry();
      this.patientRegistrationComponent.occupationComponent.patientForm = this.patientRegistrationComponent.patientForm;
    }, 20);
  }

  save() {
    this.processing = true;
    this.patientRegistrationComponent.disableFields = this.processing = true;

    this.service.updateRegistration(this.patientID, this.patientRegistrationComponent.formatValues(), {
      includes: 'allergies,names,addresses,contacts,identifiers,attributes,occupation.industry_type,emergency_contact.relationship,emergency_contact.purpose,families',
      appends: 'present_address,permanent_address'
    })
    .subscribe((response: any) => {
      this.toastr.success("Successfully updated the patient profile");
      this.router.onSameUrlNavigation = 'reload';
      this.service.setPatient(response)
      this.router.navigate(['/patient', this.patientID]);
    }, (err) => {
      this.processing = false;
      this.patientRegistrationComponent.disableFields = this.processing = false;
    });
  }

  updateFormValidity(validity) {
    this.isValid = validity;
  }
}
