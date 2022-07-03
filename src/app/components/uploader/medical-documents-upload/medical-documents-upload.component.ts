import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from 'src/app/utils/services/doctor/doctor.service';

@Component({
  selector: 'app-medical-documents-upload',
  templateUrl: './medical-documents-upload.component.html',
  styleUrls: ['./medical-documents-upload.component.scss']
})
export class MedicalDocumentsUploadComponent implements OnInit {

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();
  
  @Output()
  upload: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('uploader')
  uploader: any;

  @Input()
  format: any = 'image/*,.pdf';

  image: any;
  uploading = false;

  form: FormGroup;
  files: any = [];
  toDelete: any = [];

  constructor(
    private service: DoctorService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.files = [
      {
        file: null,
        preview: null
      }
    ];
  }

  addFile() {
    this.files.push({
      file: null,
      preview: null
    });
  }

  removeFile(index) {
    this.toDelete.push(this.files[index]);
    this.files.splice(index, 1);
  }

  selectImage(index) {
    this.uploader?._results[index].nativeElement.click();
  }

  previewUploadFile(index, event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.select.emit(this.files[index] = {
          id: null,
          batch_number: 1,
          file: file,
          name: file?.name,
          file_url: this.image = reader.result as string,
          isUploaded: false,
          category: 'medical-document',
          version: 1,
        });
      };
    }
  }
}
