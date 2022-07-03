import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ACTIVE } from 'src/app/utils/items/active';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-immunization-history',
  templateUrl: './immunization-history.component.html',
  styleUrls: ['./immunization-history.component.scss']
})
export class ImmunizationHistoryComponent implements OnInit {

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
      immunizations: this.fb.array([])
    });
  }

  add() {
    this.immunizations.push(this.create());
  }

  remove(index) {
    if(this.immunizations.at(index)?.value?.id) {
      this.toDelete.push(this.immunizations.at(index)?.value?.id);
    }
    this.immunizations.removeAt(index);
  }

  create(item = null) {
    return this.fb.group({
      id: item?.id,
      clinical_status_uid: [item?.clinical_status_uid ?? ACTIVE],
      vaccine: [item?.vaccine],
      brand_name: [item?.brand_name],
      lot_no: [item?.lot_no],
      dose_no: [item?.dose_no],
      booster_no: [item?.booster_no],
      administered_on: [item?.administered_on],
      next_dose_on: [item?.next_dose_on],
    });
  }

  get immunizations() {
    return this.form.get('immunizations') as FormArray;
  }

  transform() {
    this.immunizations.clear();

    if(this.items?.data?.length < 1) {
      this.immunizations.push(this.create());
    } else {
      this.items?.data?.forEach((item) => {
        this.immunizations.push(this.create(item));
      });
    }
  }

  list() {
    this.service.getImmunization({
      patient_id: this.patientID,
      order: 'vaccine_administered_on',
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
    this.service.saveImmunization(this.patientID, {
      immunizations: this.form.value?.immunizations?.filter((item) => item?.vaccine && item?.vaccine && item?.administered_on),
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.editMode = false;
      this.toDelete = [];
      
      this.items.data = response;
      this.transform();

      this.processing = false;
      this.toastr.success("Successfully updated the immunization history");
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
