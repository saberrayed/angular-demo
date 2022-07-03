import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HOME_PHONE, MOBILE } from 'src/app/utils/items/contactType';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @Input()
  patientForm: FormGroup;

  @Input()
  disableFields = false;

  @Input()
  patient: any;

  @Input()
  validations: any;
  contactTypes: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactTypes = this.getMasterByName('Contact Type');
  }

  addContact() {
    this.contacts.push(this.createContactForm());
  }

  removeContact(index) {
    this.contacts.removeAt(index);
  }

  get contacts() {
    return this.patientForm.get('contacts') as FormArray;
  }

  createContactForm() {
    return this.fb.group({
      type_code: [null, [Validators.required]],
      contact_details: [null, [Validators.required]],
      description: [null],
    });
  }

  isRequired(rules: string) {
    return rules ? rules.includes('required') : false;
  }

  getControl(control) {
    return this.patientForm.get(control);
  }

  getMasterByName(name: string) {
    return JSON.parse(localStorage.getItem('value_master')).find((item) => {
      return item?.text === name;
    });
  }

  getContactControl(index) {
    return this.contacts.controls;
  }

  updateValidator(index) {
    let value = null;
    this.contacts.at(index).get('contact_details').setValue(null);
    this.contacts.at(index).get('contact_details').clearValidators();

    const validations = [];

    if (
      [HOME_PHONE, MOBILE].some(
        (x) => x === this.contacts.at(index).value.type_code
      )
    ) {
      validations.push('minLength:10');
      validations.push('maxLength:10');
      validations.push('pattern:[0-9]{10}');
    }
    if (
      [HOME_PHONE, MOBILE].some(
        (x) => x === this.contacts.at(index).value.type_code
      )
    ) {
      value = null;
    }
    if (this.contacts.at(index).value.type_code === 'E') {
      validations.push('email');
    }

    const validator = validations.map((item) => {
      const items = item.split(':');

      return items?.length > 1
        ? Validators[items[0]](items[1])
        : Validators[items[0]];
    });

    this.contacts.at(index).get('contact_details').setValue(value);
    this.contacts.at(index).get('contact_details').setValidators(validator);
    this.contacts.at(index).get('contact_details').updateValueAndValidity();
  }
}
