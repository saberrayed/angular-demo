import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Output()
  preview: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  image: any;

  @Input()
  label: any;

  constructor() { }

  ngOnInit(): void {
  }

  previewUploadFile(event) {
    var id = event.target.id;
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.preview.emit({
          file: file,
          name: file?.name,
          preview: this.image = reader.result as string
        })
      };
    }
  }

}
