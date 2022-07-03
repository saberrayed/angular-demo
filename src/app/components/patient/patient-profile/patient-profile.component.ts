import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  
  @Input() patient: any;

  constructor() { }

  ngOnInit(): void {
  }

  getContact(code) {
    return this.patient?.contacts?.find((contact) => contact?.type_code === code);
  }

  getAddress(name) {
    return this.patient?.addresses?.find((address) => address?.type_code === name)?.line1;
  }

  getAttribute(name) {
    return this.patient?.attributes?.find((attribute) => attribute?.type_text === name)?.value_text;
  }
}
