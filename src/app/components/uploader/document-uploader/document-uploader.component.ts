import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/utils/services/forms/forms.service';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.scss']
})
export class DocumentUploaderComponent implements OnInit {

  @Output()
  uploaded: EventEmitter<any> = new EventEmitter<any>();
  
  @Input()
  patientID: any;

  modal = false;
  processing = false;
  tags: any = [];
  form: FormGroup;
  file: any;
  preview: any;

  constructor(
    private service: FormService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  createForm() {
    this.form = this.fb.group({
      patient_id: [this.patientID],
      name: [null, Validators.required],
      renamed: [null],
      version: [null],
      type: [null],
      description: [null],
      tags: [null],
    });
  }

  previewUploadFile(event) {
    var id = event.target.id;
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.form.patchValue({
          type: file?.type
        })
        this.file = file;
        this.preview = reader.result as string;
      };
    }
  }

  updateTags() {
    this.form.patchValue({
      tags: this.tags?.map((item) => item)?.join(',')
    });
  }

  onOpen() {
    this.modal = true;
    this.createForm();
  }

  onClose() {
    this.modal = false;
    this.file = null;
    this.preview = null;
    this.tags = [];
  }

  getControl(name) {
    return this.form.get(name);
  }

  upload() {
    this.processing = true;

    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("disk", "public");
    formData.append("folder", "uploaded");

    this.service.upload(formData)
    .subscribe((response: any) => {

      this.form.patchValue({
        renamed: response?.renamed
      });

      this.service.saveFile(this.form.value)
      .subscribe((response: any) => {
        this.toastr.success("Successfully uploaded the document");
        this.uploaded.emit(response);
        this.onClose();
        this.processing = false;
      }, (err) => {
        this.processing = false;
      });

    }, (err) => {
      this.processing = false;
    });
  }
}
