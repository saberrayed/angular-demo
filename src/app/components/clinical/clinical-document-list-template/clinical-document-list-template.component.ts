import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getStorage } from 'src/app/utils/helper/storage';
import { DRAFT_DOCUMENT, FINAL_DOCUMENT } from 'src/app/utils/items/clinicalDocumentationStatus';
import { FormService } from 'src/app/utils/services/forms/forms.service';

@Component({
  selector: 'app-clinical-document-list-template',
  templateUrl: './clinical-document-list-template.component.html',
  styleUrls: ['./clinical-document-list-template.component.scss']
})
export class ClinicalDocumentListTemplateComponent implements OnInit {
  
  @Output()
  reopen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  generatePDF: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  title = 'CLINICAL DOCUMENTS';

  @Input()
  source = 'clinical-documentation';

  processing = true;
  clinicalDocuments: any;
  draftCode = DRAFT_DOCUMENT;
  page: any = 1;
  perPage: any = 25;
  perPages = [5, 10, 25, 50, 100];
  queryParams: any = {};
  user: any;

  constructor(
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private router: Router,
    private service: FormService
  ) {}

  ngOnInit(): void {
    this.user = getStorage('current-user');
  }

  getQueryParams(page) {
    this.queryParams.page = this.page = page;
    this.queryParams.perPage = this.perPage;

    return this.queryParams;
  }

  list(page = 1) {
    this.processing = true;
    const queryParams = this.getQueryParams(page);

    this.service.getDocuments(queryParams).subscribe(
      (response: any) => {
        this.clinicalDocuments = response;
        this.processing = false;
      },
      (err) => {
        this.processing = false;
      }
    );
  }

  sendDocument(document) {
    document.sending = true;

    this.service.sendDocument(document?.id, {
      pdfs: this.getSelectedDocuments(document)?.map((item) => {
        return {
          file: item?.pdf,
          name: item?.name
        }
      })
    })
    .subscribe((response: any) => {
      this.toastr.success("File(s) has been queued for sending!",'',{
        timeOut: 3000
      });
      document.sending = false;
      document?.pdfs.forEach((pdf) => {
        pdf.selected = false;
      });
    }, (err) => {
      document.sending = false;
    })
  }

  getSelectedDocuments(document) {
    return document?.pdfs?.filter((item) => item?.selected);
  }

  updatePerPage() {
    this.list(this.page);
  }

  sanitizeHTML(html: string = '') {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getDates(date) {
    return date;
  }

  onReopenDocument(document) {
    // if (+document?.document_status_code === +FINAL_DOCUMENT) {
    //   this.reopen.emit(document);
    // } else {
      this.router.navigate([
        '/patient',
        document?.patient_id,
        'visit',
        document?.visit_id,
        'document',
        document?.template_code,
        document?.id,
      ], {
        queryParams: {
          source: this.source
        }
      });
    // }
  }

  onGeneratePDF(data) {
    this.generatePDF.emit(data);
  }

  canEdit(document) {
    if (
      document?.created_by === this.user?.id ||
      document?.approvers?.find((approver) => approver?.id === this.user?.id)
    ) {
      return true;
    }
    return false;
  }

  toggleCollapse(data) {}

  hasDisable(pdfs) {
    return pdfs?.find((item) => item.generating);
  }
}
