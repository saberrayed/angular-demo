import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClinicalDocumentFormComponent } from 'src/app/components/clinical/clinical-document-form/clinical-document-form.component';
import { FormService } from 'src/app/utils/services/forms/forms.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { VisitService } from 'src/app/utils/services/mpi/visit.service';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss']
})
export class NewDocumentComponent implements OnInit {
  
  @ViewChild('formComponent', { static: true })
  formComponent: ClinicalDocumentFormComponent;

  visitID: any;
  patientID: any;
  templateCode: any;
  patient: any;
  visit: any;

  constructor(
    private patientService: PatientService,
    private visitService: VisitService,
    private toastr: ToastrService,
    private service: FormService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientID = this.route.parent.snapshot.params.patient_id;
    this.templateCode= this.route.snapshot.params.code;
    this.visitID = this.route.snapshot.params.visit_id;

    Promise.all([this.getPatient(), this.getVisit()]).then(
      (responses: any) => {
        this.formComponent.patient = this.formComponent.formTemplate.patient = this.patient =
          responses[0];
        this.formComponent.visit = this.formComponent.formTemplate.visit = this.visit =
          responses[1];

        setTimeout(() => {
          this.formComponent.initialize(
            this.templateCode,
            this.patientID,
            this.visitID
          );
        }, 1);
      }
    );
  }

  getPatient() {
    return this.patientService
      .findPatient(this.patientID, {})
      .toPromise();
  }

  getVisit() {
    return this.visitService.findVisit(this.visitID).toPromise();
  }

  onSaveForm(data) {
    this.toastr.info(`Saving document please wait..`, '', {
      timeOut: 3000
    });
    this.formComponent.savingDocument = true;

    this.service.storeDocument(data).subscribe(
      (response: any) => {
        this.toastr.success(`Successfully created the clinical document.`);
        this.router.navigate([
          '/patient',
          this.patientID,
          'visit',
          this.visitID,
          'document',
          response?.template_code,
          response?.id,
        ], {
          queryParams: {
            source: 'clinical-documentation'
          }
        });
      },
      (err) => {
        this.formComponent.savingDocument = false;
      }
    );
  }

  onGoBack() {
    window.history.back();
    // this.router.navigate([
    //   '/patient',
    //   this.patientID,
    //   'clinical-documentation',
    // ]);
  }
}
