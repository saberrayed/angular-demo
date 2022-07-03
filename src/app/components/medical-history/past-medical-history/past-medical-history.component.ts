import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ACTIVE } from 'src/app/utils/items/active';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-past-medical-history',
  templateUrl: './past-medical-history.component.html',
  styleUrls: ['./past-medical-history.component.scss']
})
export class PastMedicalHistoryComponent implements OnInit {

  @Input()
  patientID: any;

  editMode = false;
  processing = true;
  items: any;
  form: FormGroup;

  toDelete = [];

  constructor(
    private service: MedicalHistoryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.list();
  }

  createForm() {
    this.form = this.fb.group({
      medical_histories: this.fb.array([])
    });
  }

  add() {
    this.medicalHistories.push(this.create());
  }

  remove(index) {
    if(this.medicalHistories.at(index)?.value?.id) {
      this.toDelete.push(this.medicalHistories.at(index)?.value?.id);
    }
    this.medicalHistories.removeAt(index);
  }

  create(item = null) {
    return this.fb.group({
      id: item?.id,
      condition: item?.condition,
      confinement_date: item?.confinement_date,
      remarks: item?.remarks
    });
  }

  get medicalHistories() {
    return this.form.get('medical_histories') as FormArray;
  }

  transform() {
    this.medicalHistories.clear();

    if(this.items?.data?.length < 1) {
      this.medicalHistories.push(this.create());
    } else {
      this.items?.data?.forEach((item) => {
        this.medicalHistories.push(this.create(item));
      });
    }
  }

  list() {
    this.service.getMedicalHistories({
      patient_id: this.patientID,
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.items = response;
      this.processing = false;
      this.transform();
    }, (err) => {
      this.processing = false;
    })
  }

  save() {
    this.processing = true;
    this.service.saveMedicalHistories(this.patientID, {
      medical_histories : this.form.value?.medical_histories?.filter((item) => item?.condition),
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.editMode = false;
      this.toDelete = [];
      
      this.items.data = response;
      this.transform();

      this.processing = false;
      this.toastr.success("Successfully updated the past medical history");
    }, (err) => {
      this.processing = false;
    });
  }

  cancel() {
    this.editMode = false
    this.toDelete = [];
    this.transform();
  }
}
