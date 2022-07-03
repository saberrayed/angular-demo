import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { extendMoment } from 'moment-range';
import { ValidateContactRequirement } from 'src/app/utils/validators/patient-registration.validator';
import { AddressesComponent } from '../addresses/addresses.component';
import { DemographicsComponent } from '../demographics/demographics.component';
import { IdentificationComponent } from '../identification/identification.component';
import { OccupationComponent } from '../occupation/occupation.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @Output()
  updateFormValidity: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('patientDemographics', { static: false })
  patientDemographicsComponent: DemographicsComponent;

  @ViewChild('patientAddresses', { static: false })
  patientAddressesComponent: AddressesComponent;

  @ViewChild('identifiersComponent', { static: false })
  identifiersComponent: IdentificationComponent;

  @ViewChild('occupationComponent', { static: false })
  occupationComponent: OccupationComponent;

  @Input()
  disableFields = false;

  @Input()
  patient: any;

  @Input()
  validations: any;

  @Input()
  processing: boolean = false;

  patientForm: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  createPatientForm() {
    this.patientForm = this.fb.group({
      patient: this.fb.group({
        md_id: [this.patient?.md_id],
        clinic_id: [this.patient?.clinic_id],
        patient_id: this.patient?.patient_id,
        nickname: this.patient?.nickname,
        is_newborn: this.patient ? this.patient?.is_newborn : false,
        is_fictitious_date_of_birth: this.patient ? this.patient?.is_fictitious_date_of_birth : false,
        sex_code: [this.patient ? this.patient?.sex_code : 'M', [Validators.required]],
        date_of_birth: null,
        month: [this.patient ? this.formatDate(this.patient?.date_of_birth, 'MM') : '01', [Validators.required]],
        day: [this.patient ? this.formatDate(this.patient?.date_of_birth, 'DD') : '01', [Validators.required] ],
        year: [this.patient ? this.formatDate(this.patient?.date_of_birth, 'YYYY') : null, [Validators.required]],
        photo: [this.patient ? this.patient.photo : null],
      }),
      name: this.fb.group({
        prefix: [this.patient?.primary_name?.prefix],
        first: [this.patient?.primary_name?.first, [Validators.required]],
        middle: [this.patient?.primary_name?.middle],
        last: [this.patient?.primary_name?.last, [Validators.required]],
        suffix: [this.patient?.primary_name?.suffix],
        is_primary: true,
        type_code: 'P',
        type_text: 'Primary',
        type_display: 'Primary',
      }),
      alias: this.fb.group({
        prefix: [this.patient && this.getName('A') ? this.getName('A')?.prefix : null],
        first: [this.patient && this.getName('A') ? this.getName('A')?.first : null],
        middle: [this.patient && this.getName('A') ? this.getName('A')?.middle : null],
        last: [this.patient && this.getName('A') ? this.getName('A')?.last : null],
        suffix: [this.patient && this.getName('A') ? this.getName('A')?.suffix : null],
        is_primary: false,
        type_code: 'A',
        type_text: 'Alias',
        type_display: 'Alias',
      }),
      attributes: this.fb.array([
        this.fb.group({
          type_code: 212,
          type_text: 'Nationality',
          value_code: null,
          value_text: null,
        }),
        this.fb.group({
          type_code: 2,
          type_text: 'Marital Status',
          value_code: null,
          value_text: null,
        }),
        this.fb.group({
          type_code: 9008,
          type_text: 'Religion',
          value_code: null,
          value_text: null,
        }),
      ]),
      addresses: this.fb.array([
        this.fb.group({
          type_code: 'present',
          country_code: [this.patient && this.getAddress('present') ? this.getAddress('present')?.country_code : 'PHL'],
          state_province_code: [this.patient && this.getAddress('present') ? this.getAddress('present')?.state_province_code : null],
          city_code: [this.patient && this.getAddress('present') ? this.getAddress('present')?.city_code : null],
          barangay_code: [this.patient && this.getAddress('present') ? this.getAddress('present')?.barangay_code : null],
          zip_code: [ this.patient && this.getAddress('present') ? this.getAddress('present')?.zip_code : null],
          line1: [this.patient && this.getAddress('present') ? this.getAddress('present')?.line1 : null ],
          line2: [this.patient && this.getAddress('present') ? this.getAddress('present')?.line2 : null],
          is_same_present: false,
          cities: null,
          barangays: null,
        }),
        this.fb.group({
          type_code: 'permanent',
          country_code: [this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.country_code : 'PHL'],
          state_province_code: [this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.state_province_code : null],
          city_code: [this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.city_code : null],
          barangay_code: [this.patient && this.getAddress('permanent')? this.getAddress('permanent')?.barangay_code : null],
          zip_code: [this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.zip_code : null],
          line1: [this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.line1 : null],
          line2: [this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.line2 : null],
          is_same_present: this.patient && this.getAddress('permanent') ? this.getAddress('permanent')?.is_same_present : false,
          cities: null,
          barangays: null,
        }),
      ]),
      emergency_contact: this.fb.group({
        prefix: [this.patient?.emergency_contact?.prefix],
        first: [this.patient?.emergency_contact?.first],
        middle: [this.patient?.emergency_contact?.middle],
        last: [this.patient?.emergency_contact?.last],
        suffix: [this.patient?.emergency_contact?.suffix],
        relationship_uid: [this.patient?.emergency_contact?.relationship_uid],
        purpose_uid: [this.patient?.emergency_contact?.purpose_uid],
        contact_number: [this.patient?.emergency_contact?.contact_number, [Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
        contact_patient_id: [this.patient?.emergency_contact?.contact_patient_id],
      }),
      occupation: this.fb.group({
        occupation: [this.patient?.occupation?.occupation],
        industry: [this.patient?.occupation?.industry],
        employer: [this.patient?.occupation?.employer],
      }),
      contacts: this.fb.array([], [Validators.required, Validators.minLength(2),ValidateContactRequirement]),
      identifiers: this.fb.array([]),
      families: this.fb.array([]),
    });

    this.patientForm.valueChanges.subscribe((val) => {
      setTimeout(() => {
        this.updateFormValidity.emit(this.patientForm.valid);
      }, 0);
    });
  }

  initializeAttributes() {
    if (this.patient && this.patient.attributes?.length > 0) {
      this.patientForm.value.attributes.forEach((attribute, index) => {
        const attrib = this.patient.attributes.find(
          (item) => item.type_text === attribute.type_text
        );

        if (attrib) {
          this.patientForm.get('attributes').at(index).get('value_code').setValue(attrib.value_code);
          this.patientForm.get('attributes').at(index).get('value_text').setValue(attrib.value_text);
          setTimeout(() => {
            this.patientDemographicsComponent.selectedAttribute[index] =
              attrib.value_code;
          }, 0);
        }
      });
    }
  }

  initializeAddresses() {
    if (this.patient && this.patient.addresses?.length > 0) {
      this.patientForm.value.addresses.forEach((address, index) => {
        this.patientAddressesComponent.listMunicipalities(index, false);
        this.patientAddressesComponent.listBarangay(index, false);
      });
    }
  }

  initializeContacts() {
    const contacts = this.patientForm.get('contacts') as FormArray;
    if (this.patient && this.patient.contacts?.length > 0) {
      this.patient.contacts.forEach((contact, index) => {
        contacts.push(
          this.fb.group({
            type_code: [contact?.type_code, [Validators.required]],
            contact_details: [contact?.contact_details, [Validators.required]],
            description: [contact?.description],
          })
        );
      });
    } else {
      const email_contact = contacts.value.some((item)=> item.type_code == 'E');
      if (!email_contact) {
        contacts.push(
          this.fb.group({
            type_code: ["E", [Validators.required]],
            contact_details: [null, [Validators.required]],
            description: [null],
          })
        );
      }
      const mobile_contact = contacts.value.some((item)=> item.type_code == 'M');
      if (!mobile_contact) {
        contacts.push(
          this.fb.group({
            type_code: ["M", [Validators.required]],
            contact_details: [null, [Validators.required]],
            description: [null],
          })
        );
      }
    }
  }

  initializeIdentifiers() {
    const identifiers = this.patientForm.get('identifiers') as FormArray;
    if (this.patient && this.patient.identifiers?.length > 0) {
      this.patient.identifiers.forEach((identifier) => {
        identifiers.push(
          this.fb.group({
            type_code: [identifier?.type_code, [Validators.required]],
            id_number: [identifier?.id_number, [Validators.required]],
            valid_until: [identifier?.valid_until],
            file: [identifier?.file],
          })
        );
      });
    }
  }

  initializeFamilies() {
    const families = this.patientForm.get('families') as FormArray;
    if (this.patient && this.patient.families?.length > 0) {
      this.patient.families.forEach((family) => {
        families.push(
          this.fb.group({
            prefix: [family?.prefix],
            relationship_uid: [family?.relationship_uid, [Validators.required]],
            first: [family?.first, [Validators.required]],
            middle: [family?.middle,],
            last: [family?.last, [Validators.required]],
            suffix: [family?.suffix],
            sex_code: [family?.sex_code],
            purpose_uid: [family?.purpose_uid],
            contact_number: [family?.contact_number, [Validators.required]],
          })
        );
      });
    }
  }

  formatValues() {
    const data = Object.assign({}, this.patientForm.value);
    data.patient.date_of_birth = this.patientForm.value.patient.year + '-' + this.patientForm.value.patient.month + '-' + this.patientForm.value.patient.day;
    delete data.addresses[0].cities;
    delete data.addresses[0].barangays;
    delete data.addresses[1].cities;
    delete data.addresses[1].barangays;
    return data;
  }

  formatDate(date, format) {
    const moment = extendMoment(_moment);
    return moment(date).format(format);
  }

  getName(type) {
    return this.patient ? this.patient?.names.find((name) => name.type_code === type) : null;
  }

  getAddress(type) {
    return this.patient ? this.patient?.addresses.find((address) => address.type_code === type) : null;
  }

  getFamily() {
    return this.patient?.families?.length > 0 ? this.patient.families[0] : null;
  }

  isRequired(rules: string) {
    return rules.includes('required');
  }

  getControl(control) {
    return this.patientForm.get(control);
  }
}
