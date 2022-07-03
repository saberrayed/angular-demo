import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { sex } from 'src/app/utils/items/sex';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit {
  @Input()
  patientForm: FormGroup;

  @Input()
  disableFields = false;

  @Input()
  patient: any;

  @Input()
  validations: any;

  sex: any;
  relationships: any;
  purposes: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sex = sex;
    this.relationships = this.getMasterByName('Relationship');
    this.purposes = this.getMasterByName('Purpose of Contact');
  }

  addFamily() {
    this.families.push(this.createFamilyForm());
  }

  removeFamily(index) {
    this.families.removeAt(index);
  }

  get families() {
    return this.patientForm.get('families') as FormArray;
  }

  createFamilyForm() {
    return this.fb.group({
      prefix: [null],
      relationship_uid: [null, [Validators.required]],
      first: [null, [Validators.required]],
      middle: [null],
      last: [null, [Validators.required]],
      suffix: [null],
      sex_code: [null],
      purpose_uid: [null],
      contact_number: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
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
}
