import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-past-hospitalization-history',
  templateUrl: './past-hospitalization-history.component.html',
  styleUrls: ['./past-hospitalization-history.component.scss']
})
export class PastHospitalizationHistoryComponent implements OnInit {

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
      hospitalization_surgeries: this.fb.array([])
    });
  }

  add() {
    this.hospitalizationSurgeries.push(this.create());
  }

  remove(index) {
    if(this.hospitalizationSurgeries.at(index)?.value?.id) {
      this.toDelete.push(this.hospitalizationSurgeries.at(index)?.value?.id);
    }
    this.hospitalizationSurgeries.removeAt(index);
  }

  create(item = null) {
    return this.fb.group({
      id: item?.id,
      operation_illness: item?.operation_illness,
      date: item?.date,
      location_remarks: item?.location_remarks
    });
  }

  get hospitalizationSurgeries() {
    return this.form.get('hospitalization_surgeries') as FormArray;
  }

  transform() {
    this.hospitalizationSurgeries.clear();

    if(this.items?.data?.length < 1) {
      this.hospitalizationSurgeries.push(this.create());
    } else {
      this.items?.data?.forEach((item) => {
        this.hospitalizationSurgeries.push(this.create(item));
      });
    }
  }

  list() {
    this.service.getHospitalizationSurgery({
      patient_id: this.patientID
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
    this.service.saveHospitalizationSurgery(this.patientID, {
      hospitalization_surgeries: this.form.value?.hospitalization_surgeries?.filter((item) => item?.operation_illness),
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.editMode = false;
      this.toDelete = [];
      
      this.items.data = response;
      this.transform();

      this.processing = false;
      this.toastr.success("Successfully updated the past hospitalization/surgeries");
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
