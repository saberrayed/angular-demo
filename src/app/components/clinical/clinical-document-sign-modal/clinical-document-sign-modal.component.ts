import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getStorage } from 'src/app/utils/helper/storage';
import { FINAL_DOCUMENT, FOR_REVISION, REFINALIZED, FINALIZED } from 'src/app/utils/items/clinicalDocumentationStatus';
import { CURRENT_USER } from 'src/app/utils/items/storage-names';
import { ApiService } from 'src/app/utils/services/api.service';

@Component({
  selector: 'app-clinical-document-sign-modal',
  templateUrl: './clinical-document-sign-modal.component.html',
  styleUrls: ['./clinical-document-sign-modal.component.scss']
})
export class ClinicalDocumentSignModalComponent implements OnInit {

  @Output()
  signDocument: EventEmitter<any> = new EventEmitter<any>();

  document: any = null;
  modal = false;
  autenticating = false;
  patient: any;
  visit: any;
  documentTemplate: any;
  authGroup: FormGroup;
  authError: any;

  constructor(private service: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createAuthForm();
  }

  createAuthForm() {
    this.authGroup = this.fb.group({
      email: getStorage(CURRENT_USER, true)?.email,
      password: ['', Validators.required],
      type: 'password',
    });
  }

  onOpen(patient, visit, template, document) {
    this.patient = patient;
    this.visit = visit;
    this.documentTemplate = template;
    this.document = document;
    this.modal = true;
  }

  onClose() {
    this.modal = false;
  }

  authenticate() {
    this.autenticating = true;
    this.authError = null;

    this.service.verify(this.authGroup.value).subscribe(
      (response: any) => {
        this.autenticating = false; 
        this.modal = false;

        this.createAuthForm();
        this.signDocument.emit({
          document_status_code: FINAL_DOCUMENT,
          workflow_status_code:
            this.document?.workflow_status_code === FOR_REVISION
              ? REFINALIZED
              : FINALIZED,
        });
      },
      (err) => {
        this.autenticating = false;
        this.authError = 'Invalid Credentials';
      }
    );
  }
}
