import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinical-document-html-viewer',
  templateUrl: './clinical-document-html-viewer.component.html',
  styleUrls: ['./clinical-document-html-viewer.component.scss']
})
export class ClinicalDocumentHtmlViewerComponent implements OnInit {

  @Input()
  document: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
