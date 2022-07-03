import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss']
})
export class SelectPatientComponent implements OnInit {

  processing = false;

  patients: any;
  selectedPatient: any = null;

  constructor(
    private service: PatientService
  ) {}

  ngOnInit(): void  {
    this.listPatient();
  }

  listPatient() {
    this.processing = true;
    this.service.listPatient({
      includes: 'open_visit',
      order: 'last'
    })
    .subscribe((response: any) => {
      this.processing = false;
      this.patients = response;
    }, (err) => {
      this.processing = false;
    });
  }
}
