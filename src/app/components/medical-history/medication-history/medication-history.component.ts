import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ACTIVE } from 'src/app/utils/items/active';
import { FormService } from 'src/app/utils/services/forms/forms.service';
import { MedicalHistoryService } from 'src/app/utils/services/mpi/medical-history.service';

@Component({
  selector: 'app-medication-history',
  templateUrl: './medication-history.component.html',
  styleUrls: ['./medication-history.component.scss']
})
export class MedicationHistoryComponent implements OnInit {

  @Input()
  patientID: any;

  editMode = false;
  processing = true;
  prescriptionProcessing = true;
  items: any;
  vitals: any;
  form: FormGroup;

  page = 1;
  perPage = 5;

  prescriptionPage = 1;
  prescriptionperPage = 5;

  toDelete = [];

  constructor(
    private service: MedicalHistoryService,
    private formService: FormService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.list();
    this.listPrescriptions();
  }

  createForm() {
    this.form = this.fb.group({
      medications: this.fb.array([])
    });
  }

  add() {
    this.medication.push(this.create());
  }

  remove(index) {
    if(this.medication.at(index)?.value?.id) {
      this.toDelete.push(this.medication.at(index)?.value?.id);
    }
    this.medication.removeAt(index);
  }

  create(item = null) {
    return this.fb.group({
      id: item?.id,
      date_prescribed: item?.date_prescribed,
      generic_name: item?.generic_name,
      str_form: item?.str_form,
      signa: item?.signa,
      brand_name: item?.brand_name,
      quantity: item?.quantity,
      clinical_status_uid: ACTIVE,
    });
  }

  get medication() {
    return this.form.get('medications') as FormArray;
  }

  transform() {
    this.medication.clear();

    if(this.items?.data?.length < 1) {
      this.medication.push(this.create());
    } else {
      this.items?.data?.forEach((item) => {
        this.medication.push(this.create(item));
      });
    }
  }

  list(page = 1) {
    this.processing = true;
    this.service.getMedications({
      page: this.page = page,
      perPage: this.perPage,
      sort: 'desc',
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

  listPrescriptions(page = 1) {
    this.prescriptionProcessing = true;
    this.formService.getPatientPrescriptions(this.patientID, {
      page: this.prescriptionPage = page,
      perPage: this.prescriptionperPage,
      sort: 'desc',
      patient_id: this.patientID
    })
    .subscribe((response: any) => {
      this.vitals = response;
      this.prescriptionProcessing = false;
    }, (err) => {
      this.prescriptionProcessing = false;
    })
  }

  save() {
    this.processing = true;
    this.service.saveMedications(this.patientID, {
      medications: this.form.value?.medications?.filter((item) => item?.generic_name ),
      to_delete: this.toDelete
    })
    .subscribe((response: any) => {
      this.editMode = false;
      this.toDelete = [];

      this.list(this.page);
      this.toastr.success("Successfully updated the medication history");
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
