import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit {

  patientID: any;
  patient: any;
  
  constructor(
    private route: ActivatedRoute,
    private service: PatientService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'patient-container');
    this.patientID = this.route.parent.snapshot.params.patient_id;
    this.service.patientSubject.subscribe((response: any) => {
      this.patient = response;
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }

}
