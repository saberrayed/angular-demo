import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, Form, FormBuilder } from '@angular/forms';
import { forms_url } from 'src/app/utils/helper/url';
import { DRAFT_DOCUMENT, FINALIZED, FINAL_DOCUMENT, FOR_APPROVAL, FOR_REVISION, NEW_DOCUMENT, TRACKING_DOCUMENT } from 'src/app/utils/items/clinicalDocumentationStatus';
import { FormService } from 'src/app/utils/services/forms/forms.service';
import { ClinicalDocumentFormTemplateComponent } from '../clinical-document-form-template/clinical-document-form-template.component';
import { ClinicalDocumentSignModalComponent } from '../clinical-document-sign-modal/clinical-document-sign-modal.component';

@Component({
  selector: 'app-clinical-document-form',
  templateUrl: './clinical-document-form.component.html',
  styleUrls: ['./clinical-document-form.component.scss']
})
export class ClinicalDocumentFormComponent implements OnInit {

  @Output()
  goBack: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  saveForm: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  generatePDF: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formTemplate', { static: true })
  formTemplate: ClinicalDocumentFormTemplateComponent;

  @ViewChild('signDocumentModal', { static: true })
  signDocumentModal: ClinicalDocumentSignModalComponent;

  @Input()
  document = null;

  @Input()
  patient: any = null;

  @Input()
  visit: any = null;

  @Input()
  documentTemplate: any = null;

  @Input()
  values: any = null;

  @Input()
  title: any;

  loadingPDF = false;
  loadingDocumentTemplate = false;
  templateCode = null;
  visitID = null;
  patientID = null;
  draftCode = DRAFT_DOCUMENT;
  finalCode = FINAL_DOCUMENT;
  trackingCode = TRACKING_DOCUMENT;
  forApprovalCode = FOR_APPROVAL;
  forRevisionCode = FOR_REVISION;
  newCode = NEW_DOCUMENT;
  finalizedCode = FINALIZED;

  // old
  uploadUrl = forms_url + '/file-uploader/multiple';
  formGroup: FormGroup;
  formLayout: any = {};
  forms: Form[];
  sourceDocuments: any;

  savingDocument = false;

  /**
   * TypeScript modifiers
   */
  constructor(
    private service: FormService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  initialize(code: number, patientID: any, visitID: any) {
    this.loadingDocumentTemplate = true;
    this.formTemplate.loading = true;
    this.patientID = patientID;
    this.visitID = visitID;

    Promise.all([
      this.service
        .getDocumentTemplate((this.templateCode = code), {
          includes: 'document_category,document_type,document_subtype',
        })
        .toPromise(),
      this.service
        .getDocuments({
          visit_id: this.visitID,
          patient_id: this.patientID,
          status: 'T',
        })
        .toPromise(),
    ]).then((responses: any) => {
      this.formTemplate.documentTemplate = this.documentTemplate = responses[0];

      this.formTemplate.initializeForm(responses[1]?.data);

      this.loadingDocumentTemplate = false;
    });
  }

  save(documentStatus = DRAFT_DOCUMENT, workflowStatus = NEW_DOCUMENT) {
    const data = {
      title: this.title,
      patient_id: this.patientID,
      patient_name: this.patient?.primary_name?.display,
      visit_id: this.visitID,
      document_status_code: documentStatus,
      workflow_status_code: workflowStatus,
      template_code: this.templateCode,
      values_format: this.formTemplate?.formLayout,
      values: this.formTemplate?.formGroup?.value,
    };
    this.saveForm.emit(data);
  }

  hasApprover() {
    return false;
  }

  cancel() {
    this.documentTemplate = null;
    this.values = null;
    this.document = null;
    this.cdr.detectChanges();
    this.goBack.emit();
  }

  onGeneratePDF(pdf) {
    this.generatePDF.emit(pdf);
  }

  counter(i: number) {
    return new Array(i);
  }

}
