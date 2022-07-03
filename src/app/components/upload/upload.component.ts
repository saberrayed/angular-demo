import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { mpi_url } from 'src/app/utils/helper/url';
import { TOKEN } from 'src/app/utils/items/storage-names';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-upload-file',
  styleUrls: ['./upload.component.css'],
  templateUrl: './upload.component.html',
})
export class UploadFileComponent implements OnInit {
  @ViewChild('filuploader')
  filuploader: FileUpload;

  @Input()
  isDisabled: any = false;

  @Output()
  upload = new EventEmitter<any>();

  @Output()
  remove = new EventEmitter<any>();

  @Output()
  uploadingImage = new EventEmitter<any>();

  @ViewChild('fileInput')
  fileInput: ElementRef;

  @Input()
  folder: string;

  @Input()
  disk: string = 'public';

  @Input()
  accept = 'image/*';

  @Input()
  maxFileSize = 2000000;

  @Input()
  name = 'file';

  @Input()
  uploadedFiles: any[] = [];

  @Input()
  disableFields: boolean = false;

  @Input()
  url: any;

  @Input()
  isMultiple: any = false;

  @Input()
  chooseLabel = 'Choose';

  @Input()
  mode = 'advanced';

  removedFiles: any[] = [];

  uploading: boolean = false;

  headers: any;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.headers = {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN)}`
    };
  }

  onComplete(event) {
    this.uploading = false;
    return this.upload.emit(event.originalEvent.body);
  }

  onBeforeSend(event) {
    event.formData.append('folder', this.folder);
    event.formData.append('disk', this.disk);
  }

  removeImage(image) {
    const index = this.uploadedFiles.indexOf(image);
    this.removedFiles.push(this.uploadedFiles[index]);
    this.uploadedFiles.splice(index, 1);

    this.remove.emit(this.removedFiles);
  }

  onSelect() {
    this.uploadingImage.emit();
  }

  onSend(event) {
    this.uploading = true;
  }

  isPDF(url: string) {
    return url
      ? url.substr(url.length - 3, url.length).toLowerCase() === 'pdf'
        ? true
        : false
      : false;
  }

  reset() {
    this.uploadedFiles = [];
  }

  attachUrl(filename) {
    return `${environment.mpi_url}/storage/${filename}`;
  }
}
