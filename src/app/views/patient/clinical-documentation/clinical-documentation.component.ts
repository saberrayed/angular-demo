import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicalDocumentFilterComponent } from 'src/app/components/clinical/clinical-document-filter/clinical-document-filter.component';
import { ClinicalDocumentListTemplateComponent } from 'src/app/components/clinical/clinical-document-list-template/clinical-document-list-template.component';
import { ClinicalDocumentSelectModalComponent } from 'src/app/components/clinical/clinical-document-select-modal/clinical-document-select-modal.component';
import { appendFilterParams } from 'src/app/utils/helper/url';
import { DRAFT_DOCUMENT, FINAL_DOCUMENT, TRACKING_DOCUMENT } from 'src/app/utils/items/clinicalDocumentationStatus';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';
import { VisitService } from 'src/app/utils/services/mpi/visit.service';

@Component({
  selector: 'app-clinical-documentation',
  templateUrl: './clinical-documentation.component.html',
  styleUrls: ['./clinical-documentation.component.scss']
})
export class ClinicalDocumentationComponent implements OnInit {

  @ViewChild('dialog', {static: true})
  dialog: ClinicalDocumentSelectModalComponent;

  @ViewChild('filter', {static: true})
  filter: ClinicalDocumentFilterComponent;

  @ViewChild('listTemplate', {static: true})
  listTemplate: ClinicalDocumentListTemplateComponent;

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
      this.listDocuments();
    }, 1);
  }

  getPatient() {
    this.service.findPatient(this.patientID, { includes: 'visits'})
    .subscribe((response: any) => {
      this.patient = response;
    })
  }

  listVisits() {
    this.visitService
      .getVisits({
        patient_id: this.patientID,
        order: 'admission_datetime',
        sort: 'desc',
      })
      .subscribe((response: any) => {
        this.filter.visits = this.dialog.visits = response;
        this.dialog.createForm();

        setTimeout(() => {
          this.dialog.filterForm.patchValue({
            visit_id: response?.data?.[0]?.visit_id
          });
        }, 1);
      });
  }

  listDocuments() {
    const queryParams: any = {};
    queryParams.includes =
      'pdfs,template.document_category,template.document_type,creator,editor,approvers,finalize,patient,visit';
    queryParams.order = 'created_at';
    queryParams.sort = 'desc';
    queryParams.document_statuses = [FINAL_DOCUMENT,DRAFT_DOCUMENT];
    queryParams.statuses = null;
    queryParams.user_id = false;
    queryParams.patient_id = this.patientID;
    queryParams.for_approval = false;
    
    appendFilterParams(queryParams, this.filter?.form?.value);
    this.listTemplate.queryParams = queryParams;

    setTimeout(() => {
      this.listTemplate.list();
    }, 1);
  }

  onSelectTemplate() {
    this.dialog.queryParams.includes ='document_type,document_subtype';
    // this.dialog.queryParams.template_type = 'form';
    // this.dialog.queryParams.closed_visit =  closed_visit;
    this.dialog.queryParams.except_tracking = true;
    this.dialog.queryParams.order = 'name';

    if(this.filter?.form?.value?.visit_id !== null && this.filter?.form?.value?.visit_id !== 'null') {
      this.dialog?.filterForm?.patchValue({
        visit_id: this.filter?.form?.value?.visit_id
      });
    } else {
      this.dialog?.filterForm?.patchValue({
        visit_id: this.dialog?.visits?.data?.[0]?.visit_id
      });
    }

    this.dialog.onOpen();
  }

  selectTemplate(template) {
    this.router.navigate([
      '/patient',
      this.patientID,
      'visit',
      this.dialog?.filterForm?.value?.visit_id,
      'document',
      template?.code,
    ]);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }
}
