import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getStorage } from 'src/app/utils/helper/storage';
import { appendFilterParams } from 'src/app/utils/helper/url';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { ScheduleService } from 'src/app/utils/services/schedule/schedule.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {


  perPages = [5, 10, 25, 50, 100];
  activeSort = 'asc';
  activeColumn = 'last';
  processing = false;
  patients: any;
  term: any;
  gender: any;
  page = 1;
  perPage = 25;
  form: FormGroup;

  constructor(
    private service: ScheduleService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.list();
  }

  createForm() {
    this.form = this.fb.group({
      query: [null],
      sex_code: [null]
    });
  }

  list(page = 1) {
    this.processing = true;
    let queryParams: any = {};
    queryParams.page = this.page = page;
    queryParams.perPage = this.perPage;
    queryParams.order = this.activeColumn;
    queryParams.sort = this.activeSort;
    appendFilterParams(queryParams,this.form.value);

    this.service.getAppointmentPatients(getStorage(CURRENT_USER, true)?.doctor?.md_id, queryParams)
    .subscribe((response: any) => {
      this.patients = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    });
  }

  deletePatient(patient) {
    if(confirm("Are you sure you want to delete this patient?")) {
      this.processing = true;
      this.service.deletePatient(getStorage(CURRENT_USER, true)?.doctor?.md_id, patient?.patient_id)
      .subscribe((response: any) => {
        this.toastr.success(response?.message);
        this.list();
      }, (err) => {
        this.processing = false;
      });
    }
  }

  onFilter(key, value) {
    this[key] = value;
    this.list()
  }

  sort(column) {
    if (column === this.activeColumn) {
      this.activeSort = this.activeSort === 'asc' ? 'desc' : 'asc';
    } else {
      this.activeSort = 'asc';
    }

    this.activeColumn = column;

    this.list()
  }

  counter(val) {
    return new Array(val);
  }

}
