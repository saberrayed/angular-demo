import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-clinical-document-text-template',
  templateUrl: './clinical-document-text-template.component.html',
  styleUrls: ['./clinical-document-text-template.component.scss']
})
export class ClinicalDocumentTextTemplateComponent implements OnInit {
  
  @Output()
  insertTemplate: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  templates: any[] = null;

  @Input()
  originalTemplates: any[] = null;

  @Input()
  title: string = 'Content';

  loadingTemplates: boolean = false;

  selectedTemplate: any = null;

  searchForm: FormGroup;

  groups: any[] = [];

  page: number = 1;

  perPage: number = 5;

  totalItems: number = 0;

  modal = false;

  filters = {
    omtCode: null,
    section: null,
    group: null,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createSearchForm();
  }

  onOpen() {
    this.modal = true;
    this.createSearchForm();
    this.selectedTemplate = null;
  }

  onClose() {
    this.modal = false;
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      query: [],
    });
  }

  searchTemplate() {
    this.templates = this.originalTemplates.filter(
      (template) =>
        template.name
          .toLowerCase()
          .indexOf(this.searchForm.value.query.toLowerCase()) > -1
    );
  }

  selectGroup(value) {
    if (value === 'All') {
      this.templates = this.originalTemplates;
    } else {
      this.templates = this.originalTemplates.filter(
        (template) => template.type === value
      );
    }
  }

  onInsertTemplate() {
    this.onClose();
    this.insertTemplate.emit(this.selectedTemplate.content);
  }

  getTypes() {
    const types = [];
    this.originalTemplates.forEach((template) => {
      if (types.indexOf(template.type) < 0) {
        types.push(template.type);
      }
    });
    return types;
  }
}
