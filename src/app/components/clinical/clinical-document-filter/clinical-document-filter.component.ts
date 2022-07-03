import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getStorage } from 'src/app/utils/helper/storage';
import { FormService } from 'src/app/utils/services/forms/forms.service';

@Component({
  selector: 'app-clinical-document-filter',
  templateUrl: './clinical-document-filter.component.html',
  styleUrls: ['./clinical-document-filter.component.scss']
})
export class ClinicalDocumentFilterComponent implements OnInit {
  
  @Output()
  filter: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  disableFields: any;

  @Input()
  withDoctor: boolean = false;

  @Input()
  isTracking = false;

  form: FormGroup;
  departments: any;
  visits: any;
  activeVisitID: any;
  documentTypes: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: FormService
  ) {}

  ngOnInit(): void {
    this.departments = getStorage('departments',true) || [];
    this.documentTypes = getStorage('document-types',true) || [];
    this.getDocumentTypes();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      visit_id: this.route.snapshot.queryParams?.visit,
      document_type: null,
      document_name: null,
      document_status: null,
    });
  }

  getDocumentTypes() {
    this.service.getDocumentTypes({
      order: 'code'
    })
    .subscribe((response: any) => {
      this.documentTypes = response;
    })
  }

  onFilter() {
    this.filter.emit(this.form.value);
  }

  onReset() {
    this.createForm();
    this.filter.emit(this.form.value);
  }
}
