import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {
  @Input()
  patientForm: FormGroup;

  @Input()
  disableFields = false;

  @Input()
  patient: any;

  @Input()
  validations: any;

  url: any;
  idTypes: any;

  constructor(private fb: FormBuilder, private fileService: PatientService) {}

  ngOnInit(): void {
    this.url = this.fileService.getUploadUrl();
    this.idTypes = this.getMasterByName('ID Type');
  }

  addIdentifier() {
    this.identifiers.push(this.createIdentifierForm());
  }

  removeIdentifier(index) {
    this.identifiers.removeAt(index);
  }

  get identifiers() {
    return this.patientForm.get('identifiers') as FormArray;
  }

  createIdentifierForm() {
    return this.fb.group({
      type_code: [
        null,
        this.generateValidations(
          this.getValidation('PatientIdentifier', 'type_code')
        ),
      ],
      id_number: [
        null,
        this.generateValidations(
          this.getValidation('PatientIdentifier', 'id_number')
        ),
      ],
      valid_until: [
        null,
        this.generateValidations(
          this.getValidation('PatientIdentifier', 'valid_until')
        ),
      ],
      file: [
        null,
        this.generateValidations(
          this.getValidation('PatientIdentifier', 'file')
        ),
      ],
    });
  }

  getIdentifier(index) {
    return this.identifiers.at(index);
  }

  getValidation(type, column) {
    return this.validations?.find(
      (item) => item?.type === type && item?.column === column
    );
  }

  generateValidations(validations: any) {
    return validations?.rules.split(',').map((item) => {
      return Validators[item];
    });
  }

  isRequired(rules: string) {
    return rules ? rules.includes('required') : false;
  }

  getControl(control) {
    return this.patientForm.get(control);
  }

  setUploadPhoto(file, index) {
    this.identifiers.at(index).get('file').setValue(file?.filename);
  }

  removeUploadPhoto(file, index) {
    this.identifiers.at(index).get('file').setValue(null);
  }

  getMasterByName(name: string) {
    return JSON.parse(localStorage.getItem('value_master')).find((item) => {
      return item?.text === name;
    });
  }
}
