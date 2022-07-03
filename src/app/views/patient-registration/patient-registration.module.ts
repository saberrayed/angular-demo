import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRegistrationRoutingModule } from './patient-registration-routing.module';
import { PatientRegistrationComponent } from './patient-registration.component';
import { SharedModule } from 'src/app/components/shared.module';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    PatientRegistrationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    PatientRegistrationRoutingModule
  ]
})
export class PatientRegistrationModule { }
