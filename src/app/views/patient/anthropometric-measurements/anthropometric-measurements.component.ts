import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-anthropometric-measurements',
  templateUrl: './anthropometric-measurements.component.html',
  styleUrls: ['./anthropometric-measurements.component.scss']
})
export class AnthropometricMeasurementsComponent implements OnInit {
  patientID: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: PatientService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'patient-container');
    this.patientID = this.route.parent.snapshot.params.patient_id;
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }

}
