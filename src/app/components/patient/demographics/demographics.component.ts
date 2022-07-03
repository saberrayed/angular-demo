import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray } from '@angular/forms';
import { extendMoment } from 'moment-range';
import * as _moment from 'moment';
import { days } from 'src/app/utils/items/days';
import { sex } from 'src/app/utils/items/sex';
import { months } from 'src/app/utils/items/month';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.scss']
})
export class DemographicsComponent implements OnInit {
  @Input() patientForm: FormGroup;

  @Input() disableFields = false;

  @Input() patient: any;

  @Input() validations: any;

  sex: any;
  months: any;
  days: any;
  maxYear: any;
  possibleMonth: any = 0;
  possibleDay: any = 0;

  age: any = 0;
  hasAlias = false;
  uploadUrl: string;
  nationalities: any;
  religions: any;
  civilStatuses: any;

  selectedAttribute = [null, null, null];

  constructor(private fileService: PatientService) {}

  ngOnInit(): void {
    const moment = extendMoment(_moment);
    this.sex = sex;
    this.months = months;
    this.days = days;
    this.maxYear = moment().format('YYYY');
    this.uploadUrl = this.fileService.getUploadUrl();
    this.hasAlias = this.patient && this.getName('A') ? true : false;
    this.nationalities = this.getMasterByName('Nationality');
    this.religions = this.getMasterByName('Religion');
    this.civilStatuses = this.getMasterByName('Marital Status');
    this.updateAlias();
    this.generateAge();
  }

  updateAlias() {
    if (this.hasAlias) {
      this.patientForm.get('alias').enable();
    } else {
      this.patientForm.get('alias').disable();
      this.patientForm.get('alias.prefix').reset();
      this.patientForm.get('alias.first').reset();
      this.patientForm.get('alias.middle').reset();
      this.patientForm.get('alias.last').reset();
      this.patientForm.get('alias.suffix').reset();
    }
  }

  generateYear() {
    const moment = extendMoment(_moment);
    const birthDate = moment()
      .subtract(this.age, 'years')
      .subtract(this.possibleMonth, 'months')
      .subtract(this.possibleDay, 'days');

    const estimatedYear = this.maxYear - this.age - 1;
    this.patientForm.get('patient.year').setValue(estimatedYear);
    this.possibleDay = 0;
    this.possibleMonth = 0;
  }

  generateAge() {
    const moment = extendMoment(_moment);

    if (this.patientForm.value.patient.year > this.maxYear) {
      this.patientForm.get('patient.year').setValue(this.maxYear);
    }
    const dateOfBirth = moment(
      this.patientForm.value.patient.year +
        '-' +
        this.patientForm.value.patient.month +
        '-' +
        this.patientForm.value.patient.day
    );
    const now = moment();
    const intervals = ['years', 'months', 'days']; // ['years','months','weeks','days']
    const output = [];

    intervals.forEach((interval: any) => {
      const diff = now.diff(dateOfBirth, interval);
      dateOfBirth.add(diff, interval);
      output.push(diff);
    });

    this.age = output[0];
    this.possibleMonth = output[1];
    this.possibleDay = output[2];
  }

  getBirthday(Inputyear, Inputmonth, Inputday) {
    // const moment = extendMoment(_moment);
    // let inputYear  = parseInt(Inputyear.value),
    //     inputMonth = parseInt(Inputmonth.value),
    //     inputDay   = parseInt(Inputday.value),
    //     birthday;
    // var tempBirthday = moment([inputYear, inputMonth-1, inputDay]);
    // if ( tempBirthday.isValid() ) {
    //   if ( tempBirthday.diff(new Date(), 'days') < 0 ) {
    //     birthday = tempBirthday;
    //   }
    //   else {
    //     console.log("Your birthdate must be in the past!")
    //   }
    // }
    // else if ( tempBirthday.invalidAt(2) ) {  //month overflow
    //     console.log("Day is out of range")
    // }
    // return birthday;
  }

  setUploadPhoto(file) {
    this.patientForm.get('patient.photo').setValue(file?.filename);
  }

  removeUploadPhoto(file) {
    this.patientForm.get('patient.photo').setValue(null);
  }

  getName(type) {
    return this.patient
      ? this.patient.names.find((name) => name.type_code === type)
      : null;
  }

  isRequired(rules: string, option) {
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

  updateAttribute(index, name = null, code = null) {
    const value = this[name]?.details?.find((item) => item?.code === code);

    if (value) {
      const attributes: FormArray = this.patientForm.get(
        'attributes'
      ) as FormArray;
      attributes.at(index).get('value_code').setValue(value?.code);
      attributes.at(index).get('value_text').setValue(value?.text);
    }
  }
}
