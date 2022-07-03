import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {

  patient: any;
  patientID: any;

  constructor(
    private route: ActivatedRoute,
    private service: PatientService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'patient-container');
    this.patientID = this.route.parent.snapshot.params.patient_id;

    this.service.patientSubject.subscribe((response: any) => {
      if(response) {
        this.patient = response;
      }
    })
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }
}
