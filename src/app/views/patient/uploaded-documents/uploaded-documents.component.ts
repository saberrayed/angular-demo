import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forms_url } from 'src/app/utils/helper/url';
import { FormService } from 'src/app/utils/services/forms/forms.service';
import { PatientService } from 'src/app/utils/services/mpi/patient.service';

@Component({
  selector: 'app-uploaded-documents',
  templateUrl: './uploaded-documents.component.html',
  styleUrls: ['./uploaded-documents.component.scss']
})
export class UploadedDocumentsComponent implements OnInit {

  patientID: any;
  patient: any;
  url = `${forms_url}/upload`;
  processing: any;
  files: any;
  perPages = [5, 10, 25, 50, 100];
  perPage = 10;
  page = 1;
  
  constructor(
    private route: ActivatedRoute,
    private service: FormService,
    private patientService: PatientService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'patient-container');
    
    this.patientID = this.route.parent.snapshot.params.patient_id;

    this.patientService.patientSubject.subscribe((response: any) => {
      this.patient = response;
    });

    this.list();
  }

  list(page = 1) {
    this.processing = true;

    this.service.getFiles({
      sort: 'desc',
      page: this.page = page,
      perPage: this.perPage,
      patient_id: this.patientID
    })
    .subscribe((response: any) => {
      this.files = response;
      this.processing = false;
    }, (err) => {
      this.processing = false;
    });
  }

  delete(file) {
    if(confirm("Are you sure you want to delete this file?")) {
      this.processing = true;
      this.service.deleteFile(file?.id)
      .subscribe((response: any) => {
        this.toastr.success("Successfully deleted the file");
        this.list();
      }, (err) => {
        this.processing = false;
      });
    }
  }

  download(file) {
    file.processing = true;
    this.service.downloadFile(file?.id)
    .subscribe((response: any) => {
      this.open(file, response);
      file.processing = false;
    }, (err) => {
      file.processing = false;
    });
  }

  open(file, response) {
    const type = file?.type?.split('/');
    const blob = new Blob([response], {type: file?.type});
    var downloadURL = window.URL.createObjectURL(response);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = file?.name + "." + type?.[1];
    link.click();
  }

  uploadFile(value) {

  }

  removeFile(data) {

  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'patient-container');
    // this.authSubscription.unsubscribe();
  }

}
