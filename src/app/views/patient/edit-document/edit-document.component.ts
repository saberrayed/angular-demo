import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClinicalDocumentFormComponent } from 'src/app/components/clinical/clinical-document-form/clinical-document-form.component';
import { FINAL_DOCUMENT } from 'src/app/utils/items/clinicalDocumentationStatus';
import { FormService } from 'src/app/utils/services/forms/forms.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { VisitService } from 'src/app/utils/services/mpi/visit.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})
export class EditDocumentComponent implements OnInit {

  @ViewChild('formComponent', { static: true })
  formComponent: ClinicalDocumentFormComponent;

  visitID: any;
  patientID: any;
  templateCode: any;
  documentID: any;
  patient: any;
  visit: any;
  selectedDocument: any;

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
    this.documentID = this.route.snapshot.params.document_id;

    this.route.params.subscribe((params) => {
      this.formComponent.formTemplate.loading = true;

      Promise.all([this.getPatient(), this.getVisit()]).then(
        (responses: any) => {
          this.formComponent.patient = this.formComponent.formTemplate.patient = this.patient =
            responses[0];
          this.formComponent.visit = this.formComponent.formTemplate.visit = this.visit =
            responses[1];

          this.getDocument();
        }
      );
    });
  }

  getPatient() {
    return this.patientService
      .findPatient(this.patientID, {})
      .toPromise();
  }

  getVisit() {
    return this.visitService.findVisit(this.visitID).toPromise();
  }

  getDocument() {
    this.service
      .getDocument(this.documentID, {
        includes:
          'pdfs,template,workflow_status,template.sections,approvers,creator,editor,finalize',
        load_sections: true,
      })
      .subscribe((response: any) => {
        this.formComponent.document = this.formComponent.formTemplate.document = this.selectedDocument = response;
        this.formComponent.title = response?.title;
        this.formComponent.formTemplate.values = response?.values;

        setTimeout(() => {
          this.formComponent.initialize(
            this.templateCode,
            this.patientID,
            this.visitID
          );
        }, 1);
      });
  }

  onSaveForm(data) {
    this.toastr.info(`Saving document please wait..`, '', {
      timeOut: 3000
    });
    this.formComponent.savingDocument = true;

    Promise.all([
      this.service
        .updateDocument(this.selectedDocument?.id, data, {
          includes: 'patient,pdfs,template',
        })
        .toPromise()
    ]).then(
      (responses: any) => {
        this.formComponent.document.pdfs = responses[0]?.pdfs;
        this.formComponent.document.document_status_code =
          responses[0]?.document_status_code;
        this.formComponent.document.workflow_status_code =
          responses[0]?.workflow_status_code;

        if (+responses[0]?.document_status_code === +FINAL_DOCUMENT) {
          this.toastr.success(`Successfully finalized the clinical document.`);
          this.onGoBack();
        } else {
          this.toastr.success(`Successfully updated the clinical document.`);
        }

        this.formComponent.savingDocument = false;
      },
      (err) => {
        this.formComponent.savingDocument = false;
      }
    );
  }

  onGoBack() {
    this.router.navigate([
      '/patient',
      this.patientID,
      this.route?.snapshot?.queryParams?.source,
    ]);
  }
}
