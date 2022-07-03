import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClinicalDocumentFilterComponent } from 'src/app/components/clinical/clinical-document-filter/clinical-document-filter.component';
import { ClinicalDocumentListTemplateComponent } from 'src/app/components/clinical/clinical-document-list-template/clinical-document-list-template.component';
import { ClinicalDocumentSelectModalComponent } from 'src/app/components/clinical/clinical-document-select-modal/clinical-document-select-modal.component';
import { appendFilterParams } from 'src/app/utils/helper/url';
import { FINAL_DOCUMENT, DRAFT_DOCUMENT, TRACKING_DOCUMENT } from 'src/app/utils/items/clinicalDocumentationStatus';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { VisitService } from 'src/app/utils/services/mpi/visit.service';

@Component({
  selector: 'app-patient-vital-signs',
  templateUrl: './patient-vital-signs.component.html',
  styleUrls: ['./patient-vital-signs.component.scss']
})
export class PatientVitalSignsComponent implements OnInit {

  @ViewChild('filter', {static: true})
  filter: ClinicalDocumentFilterComponent;

  @ViewChild('trackingListTemplate', {static: true})
  trackingListTemplate: ClinicalDocumentListTemplateComponent;

  patient: any;
  patientID: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: PatientService,
    private visitService: VisitService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'patient-container');
    this.patientID = this.route.parent.snapshot.params.patient_id;
    setTimeout(() => {
      this.getPatient();
      this.listVisits();
      this.listTrackingForms();
    }, 1);
  }

  getPatient() {
    this.service.findPatient(this.patientID, { includes: 'visits'})
    .subscribe((response: any) => {
      this.patient = response;
    })
  }

  listVisits() {
    this.visitService.getVisits({
      patient_id: this.patientID,
      order: 'admission_datetime',
      sort: 'desc',
    })
    .subscribe((response: any) => {
      this.filter.visits = response;
    });
  }

  listTrackingForms() {
    const queryParams: any = {};
    queryParams.includes = 'pdfs,template.document_category,template.document_type,creator,editor,approvers,finalize,patient,visit';
    queryParams.order = 'created_at';
    queryParams.sort = 'desc';
    queryParams.document_statuses = [TRACKING_DOCUMENT];
    queryParams.statuses = null;
    queryParams.user_id = false;
    queryParams.patient_id = this.patientID;
    queryParams.for_approval = false;
    
    appendFilterParams(queryParams, this.filter?.form?.value);
    this.trackingListTemplate.queryParams = queryParams;

    setTimeout(() => {
      this.trackingListTemplate.list();
    }, 1);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }
}
