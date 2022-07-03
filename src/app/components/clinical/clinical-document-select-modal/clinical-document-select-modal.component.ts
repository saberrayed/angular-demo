import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/utils/services/forms/forms.service';

@Component({
  selector: 'app-clinical-document-select-modal',
  templateUrl: './clinical-document-select-modal.component.html',
  styleUrls: ['./clinical-document-select-modal.component.scss']
})
export class ClinicalDocumentSelectModalComponent implements OnInit {
  
  @Output()
  selectForm: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  closeModal: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  showAssociatedVisit = true;

  @Input()
  redirect = false;

  user: any = null;
  modal = null;
  templates = null;
  selectedTemplate = null;
  defaultVisit = null;
  visits: any = [];
  processing = false;
  filterForm: FormGroup;
  queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private service: FormService,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('current-user'));
    this.createForm();
  }

  createForm() {
    this.filterForm = this.fb.group({
      query: [null],
      visit_id: [this.visits?.data?.[0]?.visit_id, [Validators.required]],
    });
  }

  listTemplates() {
    this.processing = true;
    this.selectedTemplate = null;
    this.queryParams.query = this.filterForm?.value?.query;

    this.service.getDocumentTemplates(this.queryParams).subscribe(
      (response: any) => {
        this.templates = response;

        if (this.templates?.data?.length === 1) {
          this.selectedTemplate = this.templates.data[0];

          if (this.redirect) {
            this.onSelect();
          }
        }

        this.processing = false;
      },
      (err) => {
        this.processing = false;
      }
    );
  }

  onSelect() {
    this.selectForm.emit(this.selectedTemplate);
    this.modal = false;
  }

  onOpen() {
    this.modal = true;
    this.listTemplates();
  }

  onClose() {
    this.modal = false;
  }

  onHide() {
    this.closeModal.emit();
  }

  reset() {
    this.processing = false;
    this.templates = null;
    this.selectedTemplate = null;
    this.createForm();
  }
}
