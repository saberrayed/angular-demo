import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emergency-contacts',
  templateUrl: './emergency-contacts.component.html',
  styleUrls: ['./emergency-contacts.component.scss']
})
export class EmergencyContactsComponent implements OnInit {
  @Input()
  patientForm: FormGroup;

  @Input()
  disableFields = false;

  @Input()
  patient: any;

  @Input()
  validations: any;

  relationships: any;
  purposes: any;

  constructor() {}

  ngOnInit(): void {
    this.relationships = this.getMasterByName('Relationship');
    this.purposes = this.getMasterByName('Purpose of Contact');
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
}
