import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistrationComponent } from 'src/app/components/patient/registration/registration.component';
import { getStorage } from 'src/app/utils/helper/storage';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss']
})
export class PatientRegistrationComponent implements OnInit {
  
  @ViewChild('patientRegistration', {static: true})
  patientRegistrationComponent: RegistrationComponent;

  confirm = false;
  isValid = false;
  processing = false;
  selectedClinic = null;
  user: any;
  
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private service: PatientService
  ) { }

  ngOnInit(): void {
    this.user = getStorage(CURRENT_USER, true);
    this.initialize();
  }

  initialize() {
    this.patientRegistrationComponent.createPatientForm();
    this.patientRegistrationComponent.initializeContacts();
    this.patientRegistrationComponent.initializeIdentifiers();

    setTimeout(() => {
      this.patientRegistrationComponent.patientForm.get('patient.md_id').setValue(this.user?.doctor?.md_id);
      this.patientRegistrationComponent.initializeAttributes();
      this.patientRegistrationComponent.initializeContacts();
      this.patientRegistrationComponent.initializeIdentifiers();
      this.patientRegistrationComponent.initializeFamilies();
      this.patientRegistrationComponent.initializeAddresses();
      this.patientRegistrationComponent.occupationComponent.initializeIndustry();
      this.patientRegistrationComponent.occupationComponent.patientForm = this.patientRegistrationComponent.patientForm;
    }, 1);
  }

  save() {
    this.patientRegistrationComponent.disableFields = this.processing = true;
    this.service.registerPatient(this.patientRegistrationComponent.formatValues())
    .subscribe((response: any) => {
      this.toastr.success("Successfully created the patient record");
      this.router.navigate(['/patients']);
    }, (err) => {
      this.patientRegistrationComponent.disableFields = this.processing = false;
    });
  }

  updateFormValidity(validity) {
    this.isValid = validity;
  }
}
